import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyName } from 'src/types/enum/auth-enum';
import { UserRepository } from 'src/auth/repository/user.repository';
import { RefreshPayload } from 'src/types/interface/auth-interface';
import { uuidToBinary } from 'src/auth/util/uuid.util';
import { LoginPlatform, UserPlatformType } from 'src/types/types';
import { GoogleRepository } from 'src/auth/repository/google.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyName.JWT_REFRESH_STR) {
  private logger: Logger = new Logger(JwtRefreshStrategy.name);
  constructor(private userRepository: UserRepository, private googleRepository: GoogleRepository) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      issuer: process.env.JWT_ISSUER,
    });
  }

  async validate(refreshPayload: RefreshPayload): Promise<UserPlatformType> {
    const { uuid, email, loginType } = refreshPayload;
    const uuidBinary: Buffer = uuidToBinary(uuid);

    let validatedUser: UserPlatformType = null;

    try {
      switch (loginType) {
        case LoginPlatform.default:
          validatedUser = await this.userRepository.findOneBy({ uuid: uuidBinary, email });
          break;
        case LoginPlatform.google:
          validatedUser = await this.googleRepository.findOneBy({ uuid: uuidBinary, email });
          break;
        default:
          validatedUser = null;
      }
    } catch (err) {
      this.logger.log(`DB error occurred(Finding user in refresh payload): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }

    if (!validatedUser) {
      this.logger.log(`Invalid access token payload: ${refreshPayload.email}`);
      throw new UnauthorizedException('Invalid access token payload');
    }

    this.logger.log(`Valid access token payload: ${refreshPayload.email}`);
    return validatedUser;
  }
}

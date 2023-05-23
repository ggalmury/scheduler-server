import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyName } from 'src/types/enum/auth-enum';
import { UserRepository } from 'src/auth/repository/user.repository';
import { AccessPayload } from 'src/types/interface/auth-interface';
import { GoogleRepository } from 'src/auth/repository/google.repository';
import { LoginPlatform, UserPlatformType } from 'src/types/types';
import { uuidToBinary } from 'src/auth/util/uuid.util';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, StrategyName.JWT_ACCESS_STR) {
  private logger: Logger = new Logger(JwtAccessStrategy.name);
  constructor(private userRepository: UserRepository, private googleRepository: GoogleRepository) {
    super({
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: process.env.JWT_ISSUER,
    });
  }

  async validate(accessPayload: AccessPayload): Promise<UserPlatformType> {
    const { uuid, email, name, loginType } = accessPayload;
    const uuidBinary: Buffer = uuidToBinary(uuid);

    let validatedUser: UserPlatformType = null;

    try {
      switch (loginType) {
        case LoginPlatform.default:
          validatedUser = await this.userRepository.findOneBy({ uuid: uuidBinary, name, email });
          break;
        case LoginPlatform.google:
          validatedUser = await this.googleRepository.findOneBy({ uuid: uuidBinary, name, email });
          break;
        default:
          validatedUser = null;
      }
    } catch (err) {
      this.logger.log(`DB error occurred(Finding user in access payload): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }

    if (!validatedUser) {
      this.logger.log(`Invalid access token payload: ${accessPayload.email}`);
      throw new UnauthorizedException('Invalid access token payload');
    }

    this.logger.log(`Valid access token payload: ${accessPayload.email}`);
    return validatedUser;
  }
}

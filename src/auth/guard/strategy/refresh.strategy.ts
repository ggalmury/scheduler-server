import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/auth/entity/user.entity';
import { StrategyName } from 'src/enum/auth-enum';
import { UserRepository } from 'src/auth/repository/user.repository';
import { RefreshPayload } from 'src/interface/auth-interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyName.JWT_REFRESH_STR) {
  private logger: Logger = new Logger(JwtRefreshStrategy.name);
  constructor(private userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      issuer: process.env.JWT_ISSUER,
    });
  }

  async validate(refreshPayload: RefreshPayload): Promise<User> {
    const validatedUser: User = await this.userRepository.validateRefreshPayload(refreshPayload);

    if (!validatedUser) {
      this.logger.log(`Invalid access token payload: ${refreshPayload.email}`);
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    this.logger.log(`Valid refresh token payload: ${refreshPayload.email}`);
    return validatedUser;
  }
}

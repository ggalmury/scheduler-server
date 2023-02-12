import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/auth/entity/user.entity';
import { StrategyName } from 'src/auth/enum/auth-enum';
import { AccessPayload } from 'src/auth/interface/jwt.payload';
import { UserRepository } from 'src/auth/repository/user.repository';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, StrategyName.JWT_ACCESS_STR) {
  private logger: Logger = new Logger(JwtAccessStrategy.name);
  constructor(private userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: process.env.JWT_ISSUER,
    });
  }

  async validate(accessPayload: AccessPayload): Promise<User> {
    const validatedUser: User = await this.userRepository.validateAccessPayload(accessPayload);

    if (!validatedUser) {
      this.logger.log(`Invalid access token payload: ${accessPayload.email}`);
      throw new UnauthorizedException('Invalid access token payload');
    }

    this.logger.log(`Valid access token payload: ${accessPayload.email}`);
    return validatedUser;
  }
}

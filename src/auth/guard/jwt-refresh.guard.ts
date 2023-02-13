import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from 'src/enum/auth-enum';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(StrategyName.JWT_REFRESH_STR) {}

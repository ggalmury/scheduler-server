import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from 'src/enum/auth-enum';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard(StrategyName.JWT_ACCESS_STR) {}

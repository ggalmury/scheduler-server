import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtil } from './util/jwt.util';
import { TokenRepository } from './repository/token.repository';
import { JwtAccessStrategy } from './guard/strategy/access.strategy';
import { JwtRefreshStrategy } from './guard/strategy/refresh.strategy';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, TokenRepository]), JwtModule.register({})],
  providers: [AuthService, GoogleService, UserRepository, TokenRepository, JwtUtil, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AuthController, GoogleController],
})
export class AuthModule {}

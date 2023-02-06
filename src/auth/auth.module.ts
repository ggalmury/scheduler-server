import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtil } from './util/jwt.util';
import { TokenRepository } from './repository/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, TokenRepository]),
    JwtModule.register({}),
  ],
  providers: [AuthService, UserRepository, TokenRepository, JwtUtil],
  controllers: [AuthController],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessPayload, RefreshPayload } from 'src/interface/auth-interface';

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(payload: AccessPayload): string {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
      issuer: process.env.JWT_ISSUER,
    });

    return accessToken;
  }

  generateRefreshToken(payload: RefreshPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
      issuer: process.env.JWT_ISSUER,
    });

    return refreshToken;
  }

  decodeToken(token: string): any {
    const decodedToken = this.jwtService.decode(token) as { [key: string]: any };

    return decodedToken;
  }

  // regenerateEachTokens()
}

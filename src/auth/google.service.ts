import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { JwtUtil } from './util/jwt.util';
import { GoogleCodeDto } from './dto/google-code.dto';
import { AccessPayload, GoogleUserAccount, RefreshPayload } from 'src/types/interface/auth-interface';
import { GoogleRepository } from './repository/google.repository';
import { GoogleUserDto } from './dto/google-user.dto';
import { TokenRepository } from './repository/token.repository';
import { LoginPlatform } from 'src/types/types';

@Injectable()
export class GoogleService {
  private logger: Logger = new Logger(GoogleService.name);

  constructor(private jwtUtil: JwtUtil, private googleRepository: GoogleRepository, private tokenRepository: TokenRepository) {}

  async googleLogin(googleCodeDto: GoogleCodeDto): Promise<GoogleUserDto> {
    const { code } = googleCodeDto;

    const googleAccessToken: string = await this.getAccessTokenFromGoogle(code);

    const userData: GoogleUserAccount = await this.getUserInfoFromGoogle(googleAccessToken);

    const googleUserDto: GoogleUserDto = new GoogleUserDto(userData.name, userData.email, new Date(), userData.picture);

    const result: GoogleUserDto = await this.googleRepository.registerOfLogin(googleUserDto);

    const accessPayload: AccessPayload = {
      uuid: result.uuid,
      name: result.name,
      email: result.email,
      loginType: LoginPlatform.google,
    };

    const refreshPayload: RefreshPayload = {
      uuid: result.uuid,
      email: result.email,
      loginType: LoginPlatform.google,
    };

    const accessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
    const refreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

    await this.tokenRepository.saveRefreshToken(result.uuid, result.email, refreshToken);

    result.accessToken = accessToken;
    result.refreshToken = refreshToken;

    return result;
  }

  async getAccessTokenFromGoogle(code: string): Promise<string> {
    const url: string = 'https://oauth2.googleapis.com/token';

    const request = {
      code,
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_PW,
      redirect_uri: process.env.GOOGLE_RD,
      grant_type: 'authorization_code',
    };

    const googleAccessToken: AxiosResponse = await axios.post(url, request, {
      headers: {
        accept: 'application/json',
      },
    });

    if (googleAccessToken.data.error) {
      this.logger.log('Failed to authorize google account');
      throw new UnauthorizedException('Failed to authorize google account');
    }

    return googleAccessToken.data.access_token;
  }

  async getUserInfoFromGoogle(accessToken: string): Promise<GoogleUserAccount> {
    const url: string = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response: AxiosResponse = await axios.get(url, config);
    return response.data;
  }
}

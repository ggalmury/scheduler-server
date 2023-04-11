import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtUtil } from './util/jwt.util';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { GoogleUserAccount } from 'src/types/interface/auth-interface';
import { GoogleRepository } from './repository/google.repository';
import { GoogleUserDto } from './dto/google-user.dto';
import { generateNewUuidV1 } from './util/uuid.util';

@Injectable()
export class GoogleService {
  private logger: Logger = new Logger(GoogleService.name);

  constructor(private jwtUtil: JwtUtil, private googleRepository: GoogleRepository) {}

  async googleLogin(googleCodeDto: GoogleCodeDto): Promise<GoogleUserDto> {
    const { code } = googleCodeDto;

    const googleAccessToken: string = await this.getAccessTokenFromGoogle(code);

    const userData: GoogleUserAccount = await this.getUserInfoFromGoogle(googleAccessToken);

    const googleUserDto: GoogleUserDto = new GoogleUserDto(userData.name, userData.email, new Date());

    const result: GoogleUserDto = await this.googleRepository.registerOfLogin(googleUserDto);

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
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response: AxiosResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', config);
    return response.data;
  }
}

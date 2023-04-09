import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtUtil } from './util/jwt.util';
import { GoogleCodeDto } from './dto/google-code.dto';
import axios, { AxiosResponse } from 'axios';
import { GoogleUserAccount } from 'src/types/interface/auth-interface';

@Injectable()
export class GoogleService {
  private logger: Logger = new Logger(GoogleService.name);

  constructor(private jwtUtil: JwtUtil) {}

  async getUser(googleCodeDto: GoogleCodeDto): Promise<GoogleUserAccount> {
    const { code } = googleCodeDto;

    const googleAccessToken: string = await this.getAccessTokenFromGoogle(code);

    const userData: GoogleUserAccount = await this.getUserInfoFromGoogle(googleAccessToken);

    return userData;
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

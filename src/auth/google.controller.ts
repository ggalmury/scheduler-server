import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleCodeDto } from './dto/google-code.dto';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}
  @Get('entry')
  entryPoint(): string {
    const url: string = `https://accounts.google.com/o/oauth2/v2/auth/identifier?response_type=code&redirect_uri=${process.env.GOOGLE_RD}&scope=profile%20email&client_id=${process.env.GOOGLE_ID}&service=lso&o2v=2&flowName=GeneralOAuthFlow`;
    return url;
  }
  @Post('user')
  async handleGoogleLogin(@Body() googleCodeDto: GoogleCodeDto): Promise<any> {
    return await this.googleService.getUser(googleCodeDto);
  }
}

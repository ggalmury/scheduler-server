import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { SignInReqDto } from './dto/signin-req.dto';
import { SignUpReqDto } from './dto/signup-req.dto';
import { SignInResDto } from './dto/signin-res.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('emailcheck')
  async emailCheck(@Body() data: { email: string }): Promise<boolean> {
    console.log(data);
    return await this.authService.isDuplicateEmail(data.email);
  }

  @Post('signup')
  async signUp(@Body() signUpReqDto: SignUpReqDto): Promise<boolean> {
    return await this.authService.register(signUpReqDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInReqDto): Promise<SignInResDto> {
    return await this.authService.login(signInDto);
  }

  @Post('token')
  @UseGuards(JwtRefreshTokenGuard)
  async newToken(@Body() regenerateTokenDto: RegenerateTokenDto): Promise<RegenerateTokenDto> {
    return await this.authService.regenerateToken(regenerateTokenDto);
  }
}

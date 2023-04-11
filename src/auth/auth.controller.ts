import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { SignInReqDto } from './dto/signin-req.dto';
import { SignUpReqDto } from './dto/signup-req.dto';
import { SignUpResDto } from './dto/signup-res.dto';
import { SignInResDto } from './dto/signin-res.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpReqDto): Promise<SignUpResDto> {
    return await this.authService.register(signUpDto);
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInReqDto): Promise<SignInResDto> {
    return await this.authService.login(signInDto);
  }

  @Post('token')
  @UseGuards(JwtRefreshTokenGuard)
  async newToken(@Body(ValidationPipe) regenerateTokenDto: RegenerateTokenDto): Promise<RegenerateTokenDto> {
    return await this.authService.regenerateToken(regenerateTokenDto);
  }
}

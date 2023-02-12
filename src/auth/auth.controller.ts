import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInUserDto } from './dto/loggedIn-user.dto';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<RegisteredUserDto> {
    return await this.authService.register(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<LoggedInUserDto> {
    return await this.authService.login(signInDto);
  }

  @Post('/token')
  @UseGuards(JwtRefreshTokenGuard)
  async newToken(@Body(ValidationPipe) regenerateTokenDto: RegenerateTokenDto): Promise<RegenerateTokenDto> {
    return await this.authService.regenerateToken(regenerateTokenDto);
  }
}

import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<User> {
    return await this.authService.register(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<User> {
    return await this.authService.login(signInDto);
  }
}

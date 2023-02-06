import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserRepository } from './repository/auth.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { SignInDto } from './dto/signin.dto';
import { JwtUtil } from './util/jwt.util';
import { AccessPayload, RefreshPayload } from './interface/jwt.payload';
import { TokenRepository } from './repository/token.repository';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { LoggedInUserDto } from './dto/loggedIn-user.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private jwtUtil: JwtUtil,
  ) {}

  async register(signUpDto: SignUpDto): Promise<RegisteredUserDto> {
    const { userName, email, credential } = signUpDto;

    const salt: string = await bcrypt.genSalt();
    const hashedCredential: string = await bcrypt.hash(credential, salt);

    const newSignUpDto: SignUpDto = new SignUpDto(userName, email, hashedCredential);

    const saveUser: User = await this.userRepository.saveUser(newSignUpDto);

    const registeredUser: RegisteredUserDto = new RegisteredUserDto(
      saveUser.uid,
      saveUser.userName,
      saveUser.email,
      saveUser.createdDt,
    );

    return registeredUser;
  }

  async login(signInDto: SignInDto): Promise<LoggedInUserDto> {
    const { email, credential } = signInDto;

    const registeredUser: User = await this.userRepository.findUser(email);

    const decodedCredential: boolean = await bcrypt.compare(credential, registeredUser.hashedCredential);

    if (decodedCredential) {
      this.logger.log(`User verificated: ${email}`);

      const accessPayload: AccessPayload = {
        userName: registeredUser.userName,
        email: registeredUser.email,
      };

      const refreshPayload: RefreshPayload = {
        email: registeredUser.email,
      };

      const accessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
      const refreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

      await this.tokenRepository.saveRefreshToken(registeredUser.email, refreshToken);

      const loggedInUser: LoggedInUserDto = new LoggedInUserDto(
        registeredUser.uid,
        registeredUser.userName,
        registeredUser.email,
        registeredUser.createdDt,
        accessToken,
        refreshToken,
      );

      return loggedInUser;
    } else if (!decodedCredential) {
      this.logger.log(`Wrong password: ${email}`);
      throw new BadRequestException('Password not matches');
    } else {
      this.logger.log('Error occurred');
      throw new InternalServerErrorException();
    }
  }
}

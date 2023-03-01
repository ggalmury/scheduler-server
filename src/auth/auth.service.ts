import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { SignInDto } from './dto/signin.dto';
import { JwtUtil } from './util/jwt.util';
import { AccessPayload, RefreshPayload } from '../interface/auth-interface';
import { TokenRepository } from './repository/token.repository';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { LoggedInUserDto } from './dto/loggedIn-user.dto';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './entity/token.entity';

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

    if (!saveUser) {
      this.logger.log(`Duplicate user email: ${email}`);
      throw new ConflictException('Duplicate email address');
    }

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

    const registeredUser: User | null = await this.userRepository.findUser(email);

    if (!registeredUser) {
      this.logger.log(`User not found: ${email}`);
      throw new NotFoundException('User not found');
    }

    const decodedCredential: boolean = await bcrypt.compare(credential, registeredUser.hashedCredential);

    if (decodedCredential) {
      this.logger.log(`User verificated: ${email}`);

      const accessPayload: AccessPayload = {
        uid: registeredUser.uid,
        userName: registeredUser.userName,
        email: registeredUser.email,
      };

      const refreshPayload: RefreshPayload = {
        uid: registeredUser.uid,
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

  async regenerateToken(regenerateTokenDto: RegenerateTokenDto): Promise<RegenerateTokenDto> {
    const { email, accessToken, refreshToken } = regenerateTokenDto;

    const decodedAccessToken: AccessPayload = this.jwtUtil.decodeToken(accessToken);

    if (email === decodedAccessToken.email) {
      const storedRefreshToken: UserToken = await this.tokenRepository.findRefreshToken(email, refreshToken);

      if (!storedRefreshToken) {
        this.logger.log(`Invalid refresh token: ${email}`);
        throw new BadRequestException('Invalid refresh token');
      }

      const accessPayload: AccessPayload = {
        uid: decodedAccessToken.uid,
        userName: decodedAccessToken.userName,
        email,
      };
      const refreshPayload: RefreshPayload = { uid: decodedAccessToken.uid, email };

      const newAccessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
      const newRefreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

      await this.tokenRepository.saveRefreshToken(email, newRefreshToken);

      const newGeneratedToken: RegenerateTokenDto = new RegenerateTokenDto(email, newAccessToken, newRefreshToken);

      this.logger.log(`Tokens are successfully regenerated: ${email}`);

      return newGeneratedToken;
    } else {
      this.logger.log(`Invalid access token payload: ${email}`);
      throw new BadRequestException('Invalid access token payload');
    }
  }
}

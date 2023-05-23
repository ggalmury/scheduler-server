import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignUpReqDto } from './dto/signup-req.dto';
import { UserRepository } from './repository/user.repository';
import { SignInReqDto } from './dto/signin-req.dto';
import { JwtUtil } from './util/jwt.util';
import { AccessPayload, RefreshPayload } from '../types/interface/auth-interface';
import { TokenRepository } from './repository/token.repository';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { UserToken } from './entity/token.entity';
import { generateNewUuidV1 } from './util/uuid.util';
import { SignInResDto } from './dto/signin-res.dto';
import { LoginPlatform } from 'src/types/types';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(private userRepository: UserRepository, private tokenRepository: TokenRepository, private jwtUtil: JwtUtil) {}

  async isDuplicateEmail(email: string): Promise<boolean> {
    const user: SignInResDto = await this.userRepository.findUser(email);

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async register(signUpReqDto: SignUpReqDto): Promise<boolean> {
    const { email, password } = signUpReqDto;

    const uuid: string = generateNewUuidV1();

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    signUpReqDto.uuid = uuid;
    signUpReqDto.password = hashedPassword;

    const didUserSave: boolean = await this.userRepository.saveUser(signUpReqDto);

    if (!didUserSave) {
      this.logger.log(`Duplicate user email: ${email}`);
      throw new ConflictException('Duplicate email address');
    }

    return didUserSave;
  }

  async login(signInReqDto: SignInReqDto): Promise<SignInResDto> {
    const { email, password } = signInReqDto;

    const registeredUser: SignInResDto = await this.userRepository.findUser(email);

    if (!registeredUser) {
      this.logger.log(`User not found: ${email}`);
      throw new NotFoundException('User not found');
    }

    const decodedPassword: boolean = await bcrypt.compare(password, registeredUser.password);

    if (decodedPassword) {
      const accessPayload: AccessPayload = {
        uuid: registeredUser.uuid,
        name: registeredUser.name,
        email: registeredUser.email,
        loginType: LoginPlatform.default,
      };

      const refreshPayload: RefreshPayload = {
        uuid: registeredUser.uuid,
        email: registeredUser.email,
        loginType: LoginPlatform.default,
      };

      const accessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
      const refreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

      await this.tokenRepository.saveRefreshToken(registeredUser.uuid, registeredUser.email, refreshToken);

      registeredUser.accessToken = accessToken;
      registeredUser.refreshToken = refreshToken;
      delete registeredUser.password;

      this.logger.log(`User verificated: ${email}`);
      return registeredUser;
    } else if (!decodedPassword) {
      this.logger.log(`Wrong password: ${email}`);
      throw new BadRequestException('Password not matches');
    } else {
      this.logger.log('Error occurred');
      throw new InternalServerErrorException();
    }
  }

  async regenerateToken(regenerateTokenDto: RegenerateTokenDto): Promise<RegenerateTokenDto> {
    const { uuid, email, accessToken, refreshToken } = regenerateTokenDto;

    const decodedAccessToken: AccessPayload = this.jwtUtil.decodeToken(accessToken);

    if (uuid === decodedAccessToken.uuid) {
      const storedRefreshToken: UserToken = await this.tokenRepository.findRefreshToken(uuid, refreshToken);

      if (!storedRefreshToken) {
        this.logger.log(`Invalid refresh token: ${email}`);
        throw new BadRequestException('Invalid refresh token');
      }

      const accessPayload: AccessPayload = {
        uuid: decodedAccessToken.uuid,
        name: decodedAccessToken.name,
        email,
        loginType: decodedAccessToken.loginType,
      };

      const refreshPayload: RefreshPayload = { uuid: decodedAccessToken.uuid, email, loginType: decodedAccessToken.loginType };

      const newAccessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
      const newRefreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

      await this.tokenRepository.saveRefreshToken(uuid, email, newRefreshToken);

      const newGeneratedToken: RegenerateTokenDto = new RegenerateTokenDto(uuid, email, newAccessToken, newRefreshToken);

      this.logger.log(`Tokens are successfully regenerated: ${email}`);

      return newGeneratedToken;
    } else {
      this.logger.log(`Invalid access token payload: ${email}`);
      throw new BadRequestException('Invalid access token payload');
    }
  }
}

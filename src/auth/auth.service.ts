import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { SignUpReqDto } from './dto/signup-req.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { SignInReqDto } from './dto/signin-req.dto';
import { JwtUtil } from './util/jwt.util';
import { AccessPayload, RefreshPayload } from '../types/interface/auth-interface';
import { TokenRepository } from './repository/token.repository';
import { RegenerateTokenDto } from './dto/regenerate-token.dto';
import { UserToken } from './entity/token.entity';
import { generateNewUuidV1 } from './util/uuid.util';
import { SignUpResDto } from './dto/signup-res.dto';
import { SignInResDto } from './dto/signin-res.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(private userRepository: UserRepository, private tokenRepository: TokenRepository, private jwtUtil: JwtUtil) {}

  async register(signUpReqDto: SignUpReqDto): Promise<SignUpResDto> {
    const { userName, email, credential } = signUpReqDto;

    const uuid: string = generateNewUuidV1();

    const salt: string = await bcrypt.genSalt();
    const hashedCredential: string = await bcrypt.hash(credential, salt);

    const newSignUpDto: SignUpReqDto = new SignUpReqDto(uuid, userName, email, hashedCredential);

    const saveUser: SignUpResDto = await this.userRepository.saveUser(newSignUpDto);

    if (!saveUser) {
      this.logger.log(`Duplicate user email: ${email}`);
      throw new ConflictException('Duplicate email address');
    }

    return saveUser;
  }

  async login(signInReqDto: SignInReqDto): Promise<SignInResDto> {
    const { email, credential } = signInReqDto;

    const registeredUser: SignInResDto = await this.userRepository.findUser(email);

    if (!registeredUser) {
      this.logger.log(`User not found: ${email}`);
      throw new NotFoundException('User not found');
    }

    const decodedCredential: boolean = await bcrypt.compare(credential, registeredUser.hashedCredential);

    if (decodedCredential) {
      const accessPayload: AccessPayload = {
        uuid: registeredUser.uuid,
        userName: registeredUser.userName,
        email: registeredUser.email,
      };

      const refreshPayload: RefreshPayload = {
        uuid: registeredUser.uuid,
        email: registeredUser.email,
      };

      const accessToken: string = this.jwtUtil.generateAccessToken(accessPayload);
      const refreshToken: string = this.jwtUtil.generateRefreshToken(refreshPayload);

      await this.tokenRepository.saveRefreshToken(registeredUser.uuid, registeredUser.email, refreshToken);

      registeredUser.accessToken = accessToken;
      registeredUser.refreshToken = refreshToken;
      delete registeredUser.hashedCredential;

      this.logger.log(`User verificated: ${email}`);
      return registeredUser;
    } else if (!decodedCredential) {
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
        userName: decodedAccessToken.userName,
        email,
      };
      const refreshPayload: RefreshPayload = { uuid: decodedAccessToken.uuid, email };

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

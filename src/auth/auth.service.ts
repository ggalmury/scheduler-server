import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserRepository } from './repository/auth.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(private userRepository: UserRepository) {}

  async register(signUpDto: SignUpDto): Promise<User> {
    const { userName, email, credential } = signUpDto;

    const salt: string = await bcrypt.genSalt();
    const hashedCredentialFinal: string = await bcrypt.hash(credential, salt);

    const newSignUpDto: SignUpDto = new SignUpDto(
      userName,
      email,
      hashedCredentialFinal,
    );

    return await this.userRepository.saveUser(newSignUpDto);
  }

  async login(signInDto: SignInDto): Promise<User> {
    const { email, credential } = signInDto;

    const registeredUser: User = await this.userRepository.findUser(email);

    const decodedCredential = await bcrypt.compare(
      credential,
      registeredUser.hashedCredential,
    );

    if (decodedCredential) {
      // TODO: implememt jwt authentication logic
      this.logger.log(`User verificated: ${email}`);

      return registeredUser;
    } else if (!decodedCredential) {
      this.logger.log(`Wrong password ${email}`);
      throw new BadRequestException('Password not matches');
    } else {
      this.logger.log('Error occurred');
      throw new InternalServerErrorException();
    }
  }
}

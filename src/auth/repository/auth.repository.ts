import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../dto/signup.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger: Logger = new Logger(UserRepository.name);
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUser(signUpDto: SignUpDto): Promise<User> {
    const { userName, email, credential } = signUpDto;

    try {
      const result = await this.create({
        userName,
        email,
        hashedCredential: credential,
      }).save();

      this.logger.log(`User successfully created: ${email}`);

      return result;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        this.logger.log(`Duplicate user email: ${email}`);
        throw new ConflictException('Duplicate email address');
      } else {
        this.logger.log('DB error occurred');
        throw new InternalServerErrorException('DB error occurred');
      }
    }
  }

  async findUser(email: string): Promise<User> {
    let user: User;

    try {
      user = await this.findOneBy({ email });
    } catch (err) {
      this.logger.log('DB error occurred');
      throw new InternalServerErrorException('DB error occurred');
    }

    if (!user) {
      this.logger.log(`User not found: ${email}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }
}

import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../dto/signup.dto';
import { User } from '../entity/user.entity';
import { AccessPayload, RefreshPayload } from '../interface/jwt.payload';

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
        createdDt: new Date(),
      }).save();

      this.logger.log(`User successfully created: ${email}`);

      return result;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return null;
      } else {
        this.logger.log(`DB error occurred(User saving process): ${email}`);
        throw new InternalServerErrorException('DB error occurred');
      }
    }
  }

  async findUser(email: string): Promise<User> {
    try {
      const user: User = await this.findOneBy({ email });

      return user;
    } catch (err) {
      this.logger.log(`DB error occurred(User finding process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async validateAccessPayload(accessPayload: AccessPayload): Promise<User> {
    const { userName, email } = accessPayload;

    try {
      const user: User = await this.findOneBy({ userName, email });

      return user;
    } catch (err) {
      this.logger.log(`DB error occurred(Finding user in access payload): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async validateRefreshPayload(refreshPayload: RefreshPayload): Promise<User> {
    const { email } = refreshPayload;

    try {
      const user: User = await this.findOneBy({ email });

      return user;
    } catch (err) {
      this.logger.log(`DB error occurred(Finding user in refresh payload): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignUpReqDto } from '../dto/signup-req.dto';
import { User } from '../entity/user.entity';
import { binaryToUuid, uuidToBinary } from '../util/uuid.util';
import { SignUpResDto } from '../dto/signup-res.dto';
import { SignInResDto } from '../dto/signin-res.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger: Logger = new Logger(UserRepository.name);

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUser(signUpDto: SignUpReqDto): Promise<SignUpResDto> {
    const { uuid, userName, email, credential } = signUpDto;

    const uuidBinary: Buffer = uuidToBinary(uuid);

    try {
      const result: User = await this.create({
        uuid: uuidBinary,
        userName,
        email,
        hashedCredential: credential,
        createdDt: new Date(),
      }).save();

      const signUpResDto: SignUpResDto = new SignUpResDto(result.uid, uuid, result.userName, result.email, result.createdDt, true);

      this.logger.log(`User successfully created: ${email}`);

      return signUpResDto;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return null;
      } else {
        this.logger.log(`DB error occurred(User saving process): ${email}`);
        throw new InternalServerErrorException('DB error occurred');
      }
    }
  }

  async findUser(email: string): Promise<SignInResDto> {
    try {
      const user: User = await this.findOneBy({ email });

      const uuidOrigin: string = binaryToUuid(user.uuid);

      const signInResDto: SignInResDto = new SignInResDto(user.uid, uuidOrigin, user.userName, user.email, user.createdDt, user.hashedCredential);

      return signInResDto;
    } catch (err) {
      this.logger.log(`DB error occurred(User finding process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

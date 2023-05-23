import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignUpReqDto } from '../dto/signup-req.dto';
import { User } from '../entity/user.entity';
import { binaryToUuid, uuidToBinary } from '../util/uuid.util';
import { SignInResDto } from '../dto/signin-res.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger: Logger = new Logger(UserRepository.name);

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUser(signUpReqDto: SignUpReqDto): Promise<boolean> {
    const { email, password, name, birth, job, uuid } = signUpReqDto;
    console.log(signUpReqDto);

    const uuidBinary: Buffer = uuidToBinary(uuid);

    try {
      await this.create({
        uuid: uuidBinary,
        email,
        password,
        name,
        birth: new Date(birth),
        job,
        createdDt: new Date(),
      }).save();

      this.logger.log(`User successfully created: ${email}`);

      return true;
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

      if (!user) {
        return null;
      }

      const uuidOrigin: string = binaryToUuid(user.uuid);

      const signInResDto: SignInResDto = new SignInResDto(user.email, user.name, user.job, user.birth, user.createdDt, uuidOrigin, user.password);

      return signInResDto;
    } catch (err) {
      this.logger.log(`DB error occurred(User finding process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

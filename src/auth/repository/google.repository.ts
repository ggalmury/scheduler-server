import { DataSource, Repository } from 'typeorm';
import { GoogleUser } from '../entity/google.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleUserDto } from '../dto/google-user.dto';
import { binaryToUuid, generateNewUuidV1, uuidToBinary } from '../util/uuid.util';

@Injectable()
export class GoogleRepository extends Repository<GoogleUser> {
  private logger: Logger = new Logger(GoogleRepository.name);

  constructor(private datasource: DataSource) {
    super(GoogleUser, datasource.createEntityManager());
  }

  async registerOfLogin(googleUserDto: GoogleUserDto): Promise<GoogleUserDto> {
    const { userName, email, createdDt, image } = googleUserDto;

    const registeredUser: GoogleUser = await this.findOneBy({ email });

    if (registeredUser) {
      const uuidOrigin: string = binaryToUuid(registeredUser.uuid);

      googleUserDto.uuid = uuidOrigin;
      googleUserDto.uid = registeredUser.uid;

      this.logger.log(`Successfully logged in with Google account: ${email}`);

      return googleUserDto;
    } else {
      try {
        const uuid: string = generateNewUuidV1();
        const binaryUuid: Buffer = uuidToBinary(uuid);

        const registerUser: GoogleUser = await this.create({
          uuid: binaryUuid,
          userName,
          email,
          image,
          createdDt,
        }).save();

        googleUserDto.uuid = uuid;
        googleUserDto.uid = registerUser.uid;

        this.logger.log(`Google user successfully created: ${email}`);

        return googleUserDto;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return null;
        } else {
          this.logger.log(`DB error occurred(Google user saving process): ${email}`);
          throw new InternalServerErrorException('DB error occurred');
        }
      }
    }
  }
}

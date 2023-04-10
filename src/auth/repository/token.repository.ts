import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserToken } from '../entity/token.entity';
import { uuidToBinary } from '../util/uuid.util';

@Injectable()
export class TokenRepository extends Repository<UserToken> {
  private logger: Logger = new Logger(TokenRepository.name);

  constructor(private datasource: DataSource) {
    super(UserToken, datasource.createEntityManager());
  }

  async saveRefreshToken(uuid: string, email: string, refreshToken: string): Promise<void> {
    const uuidBinary: Buffer = uuidToBinary(uuid);

    try {
      await this.save({ uuid: uuidBinary, refreshToken });

      this.logger.log(`Refresh Token successfully saved: ${email}`);
    } catch (err) {
      console.log(err);
      this.logger.log(`'DB error occured(RefreshToken saving process)': ${email}`);
      throw new InternalServerErrorException('DB error occured');
    }
  }

  async findRefreshToken(uuid: string, refreshToken: string): Promise<UserToken> {
    const uuidBinary: Buffer = uuidToBinary(uuid);

    const getRefreshToken: UserToken = await this.findOneBy({ uuid: uuidBinary, refreshToken });

    return getRefreshToken;
  }
}

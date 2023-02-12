import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserToken } from '../entity/token.entity';

@Injectable()
export class TokenRepository extends Repository<UserToken> {
  private logger: Logger = new Logger(TokenRepository.name);

  constructor(private datasource: DataSource) {
    super(UserToken, datasource.createEntityManager());
  }

  async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
    try {
      await this.save({ email, refreshToken });
      this.logger.log(`Refresh Token successfully saved: ${email}`);
    } catch (err) {
      console.log(err);
      this.logger.log(`'DB error occured(RefreshToken saving process)': ${email}`);
      throw new InternalServerErrorException('DB error occured');
    }
  }

  async findRefreshToken(email: string, refreshToken: string): Promise<UserToken> {
    const getRefreshToken: UserToken = await this.findOneBy({ email, refreshToken });

    return getRefreshToken;
  }
}

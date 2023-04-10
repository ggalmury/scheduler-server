import { IsNotEmpty } from 'class-validator';

export class RegenerateTokenDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;

  constructor(uuid: string, email: string, accessToken: string, refreshToken: string) {
    this.uuid = uuid;
    this.email = email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

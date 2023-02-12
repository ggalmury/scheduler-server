import { IsNotEmpty } from 'class-validator';

export class RegenerateTokenDto {
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;

  constructor(email: string, accessToken: string, refreshToken: string) {
    this.email = email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

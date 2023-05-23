export class RegenerateTokenDto {
  uuid: string;
  email: string;
  accessToken: string;
  refreshToken: string;

  constructor(uuid: string, email: string, accessToken: string, refreshToken: string) {
    this.uuid = uuid;
    this.email = email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

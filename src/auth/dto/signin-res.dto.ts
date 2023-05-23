export class SignInResDto {
  email: string;
  name: string;
  job: string;
  birth: Date;
  createdDt: Date;
  uuid?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;

  constructor(email: string, name: string, job: string, birth: Date, createdDt: Date, uuid?: string, password?: string, accessToken?: string, refreshToken?: string) {
    this.email = email;
    this.name = name;
    this.job = job;
    this.birth = birth;
    this.createdDt = createdDt;
    this.uuid = uuid;
    this.password = password;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

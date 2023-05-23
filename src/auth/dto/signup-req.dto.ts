export class SignUpReqDto {
  email: string;
  password: string;
  name: string;
  birth: Date;
  job: string;
  uuid: string;

  constructor(email: string, password: string, name: string, birth: Date, job: string, uuid?: string) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.birth = birth;
    this.job = job;
    this.uuid = uuid;
  }
}

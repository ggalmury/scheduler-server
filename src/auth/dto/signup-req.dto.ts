import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpReqDto {
  uuid?: string;
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  credential: string;

  constructor(uuid: string, userName: string, email: string, credential: string) {
    this.uuid = uuid;
    this.userName = userName;
    this.email = email;
    this.credential = credential;
  }
}

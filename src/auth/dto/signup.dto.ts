import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  credential: string;

  constructor(userName: string, email: string, credential: string) {
    this.userName = userName;
    this.email = email;
    this.credential = credential;
  }
}

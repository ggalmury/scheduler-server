import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInReqDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  credential: string;
}

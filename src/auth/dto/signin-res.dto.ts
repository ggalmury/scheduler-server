import { Account, Token } from 'src/types/interface/auth-interface';

export class SignInResDto {
  account: Account;
  token: Token;
  password?: string;
  uuid?: string;

  constructor(account: Account, token: Token, uuid?: string, password?: string) {
    this.account = account;
    this.token = token;
    this.uuid = uuid;
    this.password = password;
  }
}

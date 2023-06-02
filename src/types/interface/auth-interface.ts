import { LoginPlatformType } from '../types';

export interface Account {
  uuid: string;
  email: string;
  name: string;
  job: string;
  birth: Date;
  createdDt: Date;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface AccessPayload {
  uuid: string;
  name: string;
  email: string;
  loginType: LoginPlatformType;
}

export interface RefreshPayload {
  uuid: string;
  email: string;
  loginType: LoginPlatformType;
}

export interface GoogleUserAccount {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
}

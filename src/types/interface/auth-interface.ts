import { LoginPlatformType } from '../types';

export interface AccessPayload {
  uuid: string;
  userName: string;
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

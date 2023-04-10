export interface AccessPayload {
  uuid: string;
  userName: string;
  email: string;
}

export interface RefreshPayload {
  uuid: string;
  email: string;
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

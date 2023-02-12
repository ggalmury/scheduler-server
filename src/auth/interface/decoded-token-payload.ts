export interface DecodedAccessTokenPayload {
  userName: string;
  email: string;
  iat: Date;
  exp: Date;
  iss: string;
}

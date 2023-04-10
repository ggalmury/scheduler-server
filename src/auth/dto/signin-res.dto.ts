export class SignInResDto {
  uid: number;
  uuid: string;
  userName: string;
  email: string;
  createdDt: Date;
  hashedCredential?: string;
  accessToken?: string;
  refreshToken?: string;

  constructor(uid: number, uuid: string, userName: string, email: string, createdDt: Date, hashedCredential?: string, accessToken?: string, refreshToken?: string) {
    this.uid = uid;
    this.uuid = uuid;
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
    this.hashedCredential = hashedCredential;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

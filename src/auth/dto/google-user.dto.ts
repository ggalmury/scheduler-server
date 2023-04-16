export class GoogleUserDto {
  userName: string;
  email: string;
  createdDt: Date;
  image?: string;
  uuid?: string;
  uid?: number;
  accessToken?: string;
  refreshToken?: string;

  constructor(userName: string, email: string, createdDt: Date, image?: string, uuid?: string, uid?: number, accessToken?: string, refreshToken?: string) {
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
    this.image = image;
    this.uuid = uuid;
    this.uid = uid;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

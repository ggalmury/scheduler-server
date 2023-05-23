export class GoogleUserDto {
  email: string;
  name: string;
  createdDt: Date;
  image?: string;
  uuid?: string;
  uid?: number;
  accessToken?: string;
  refreshToken?: string;

  constructor(email: string, name: string, createdDt: Date, image?: string, uuid?: string, uid?: number, accessToken?: string, refreshToken?: string) {
    this.email = email;
    this.name = name;
    this.createdDt = createdDt;
    this.image = image;
    this.uuid = uuid;
    this.uid = uid;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

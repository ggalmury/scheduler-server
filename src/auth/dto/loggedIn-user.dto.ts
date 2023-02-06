export class LoggedInUserDto {
  uid: number;
  userName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  createdDt: Date;

  constructor(
    uid: number,
    userName: string,
    email: string,
    createdDt: Date,
    accessToken: string,
    refreshToken: string,
  ) {
    this.uid = uid;
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

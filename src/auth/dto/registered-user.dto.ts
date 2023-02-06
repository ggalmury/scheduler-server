export class RegisteredUserDto {
  uid: number;
  userName: string;
  email: string;
  createdDt: Date;

  constructor(uid: number, userName: string, email: string, createdDt: Date) {
    this.uid = uid;
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
  }
}

export class SignUpResDto {
  uid: number;
  uuid: string;
  userName: string;
  email: string;
  createdDt: Date;

  constructor(uid: number, uuid: string, userName: string, email: string, createdDt: Date) {
    this.uid = uid;
    this.uuid = uuid;
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
  }
}

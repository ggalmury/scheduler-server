export class SignUpResDto {
  uid: number;
  uuid: string;
  userName: string;
  email: string;
  createdDt: Date;
  success: boolean;

  constructor(uid: number, uuid: string, userName: string, email: string, createdDt: Date, success: boolean) {
    this.uid = uid;
    this.uuid = uuid;
    this.userName = userName;
    this.email = email;
    this.createdDt = createdDt;
    this.success = success;
  }
}

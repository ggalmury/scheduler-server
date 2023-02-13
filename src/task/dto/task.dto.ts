import { TaskPrivacy } from 'src/enum/task-enum';
import { TaskPeriod } from 'src/interface/task-interface';

export class CreatedTaskDto {
  uid: number;
  userName: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: TaskPeriod;
  privacy: TaskPrivacy;
  createdDt: Date;
}

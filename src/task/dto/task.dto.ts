import { TaskPrivacy } from 'src/enum/task-enum';
import { TaskTimePeriod } from 'src/interface/task-interface';

export class CreatedTaskDto {
  uid: number;
  userName: string;
  email: string;
  title: string;
  description: string;
  color: string;
  location: string;
  date: Date;
  time: TaskTimePeriod;
  privacy: TaskPrivacy;
}

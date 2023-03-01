import { TaskColor, TaskPrivacy, TaskType } from 'src/enum/task-enum';
import { TaskTime } from 'src/interface/task-interface';

export class CreatedTaskDto {
  title: string;
  description: string;
  color: TaskColor;
  location: string;
  date: Date;
  time: TaskTime;
  privacy: TaskPrivacy;
  type: TaskType;
}

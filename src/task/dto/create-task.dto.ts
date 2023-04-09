import { TaskTime } from 'src/types/interface/task-interface';
import { TaskPrivacy, TaskType, Types } from 'src/types/types';

export class CreatedTaskDto {
  title: string;
  description: string;
  location: string;
  date: string;
  time: TaskTime;
  privacy: Types<typeof TaskPrivacy>;
  type: Types<typeof TaskType>;
}

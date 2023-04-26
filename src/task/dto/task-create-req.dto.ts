import { TaskTime } from 'src/types/interface/task-interface';
import { TaskPrivacyType, TaskTypeType } from 'src/types/types';

export class TaskCreateReqDto {
  title: string;
  description: string;
  location: string;
  date: string;
  time: TaskTime;
  privacy: TaskPrivacyType;
  type: TaskTypeType;
}

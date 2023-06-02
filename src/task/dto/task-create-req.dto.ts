import { TaskTime } from 'src/types/interface/task-interface';

export class TaskCreateReqDto {
  title: string;
  description: string;
  location: string;
  date: string;
  time: TaskTime;
  privacy: string;
  color: string;
}

import { CreatedTodo } from 'src/todo/entity/created-todo.entity';
import { TaskTime } from 'src/types/interface/task-interface';

export class TaskResDto {
  taskId: number;
  uuid: string;
  userName: string;
  email: string;
  title: string;
  description: string;
  color: string;
  location: string;
  date: string;
  time: TaskTime;
  privacy: string;
  createdDt: Date;
  state: boolean;
  createdTodo: CreatedTodo[];

  constructor(
    taskId: number,
    uuid: string,
    userName: string,
    email: string,
    title: string,
    description: string,
    color: string,
    location: string,
    date: string,
    time: TaskTime,
    privacy: string,
    createdDt: Date,
    state: boolean,
    createdTodo: CreatedTodo[],
  ) {
    this.taskId = taskId;
    this.uuid = uuid;
    this.userName = userName;
    this.email = email;
    this.title = title;
    this.description = description;
    this.color = color;
    this.location = location;
    this.date = date;
    this.time = time;
    this.privacy = privacy;
    this.createdDt = createdDt;
    this.state = state;
    this.createdTodo = createdTodo;
  }
}

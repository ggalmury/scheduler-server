import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { TaskColor, TaskType } from 'src/enum/task-enum';
import { CreatedTodoDto } from 'src/todo/dto/create-todo.dto';
import { DataSource, Repository } from 'typeorm';
import { CreatedTaskDto } from '../dto/create-task.dto';
import { DeleteOrDoneTaskDto } from '../dto/delete-task.dto';
import { CreatedTask } from '../entity/created-task.entity';

@Injectable()
export class TaskRepository extends Repository<CreatedTask> {
  private logger: Logger = new Logger(TaskRepository.name);

  constructor(private dataSource: DataSource) {
    super(CreatedTask, dataSource.createEntityManager());
  }

  async createTask(user: User, createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    const { uid, userName, email } = user;
    const { title, description, color, location, date, time, privacy, type } = createdTaskDto;

    try {
      const result: CreatedTask = await this.create({
        uid,
        userName,
        email,
        title,
        description,
        color,
        location,
        date: new Date(date),
        time,
        privacy,
        type,
        createdDt: new Date(),
      }).save();

      this.logger.log(`Task successfully created: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async searchTask(user: User): Promise<CreatedTask[]> {
    const { uid, email } = user;

    try {
      const result: CreatedTask[] = await this.findBy({ uid });

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task searching process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async deleteTask(user: User, deleteTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    const { uid, email } = user;
    const { taskId } = deleteTaskDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uid, taskId });

      if (result) {
        await this.remove(result);
      }

      result.taskId = taskId;

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task deleting process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async doneTask(user: User, doneTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    const { uid, email } = user;
    const { taskId } = doneTaskDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uid, taskId });

      if (result) {
        result.state = true;

        if (result.type === TaskType.MAIN_TASK) {
          result.color = TaskColor.OFFICIAL_TASK_FINISH;
        } else {
          result.color = TaskColor.PERSONAL_TASK_FINISH;
        }

        await this.save(result);

        return result;
      }
    } catch (err) {
      this.logger.log(`DB error occurred(Task deleting process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async findTaskById(user: User, createdTodoDto: CreatedTodoDto): Promise<CreatedTask> {
    const { email, uid } = user;
    const { taskId } = createdTodoDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uid, taskId });

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task validating process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

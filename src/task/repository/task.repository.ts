import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatedTodoDto } from 'src/todo/dto/create-todo.dto';
import { Between, DataSource, Repository } from 'typeorm';
import { CreatedTaskDto } from '../dto/create-task.dto';
import { DeleteOrDoneTaskDto } from '../dto/delete-task.dto';
import { SearchTaskDto } from '../dto/search-task.dto';
import { CreatedTask } from '../entity/created-task.entity';
import { UserPlatformType } from 'src/types/types';

@Injectable()
export class TaskRepository extends Repository<CreatedTask> {
  private logger: Logger = new Logger(TaskRepository.name);

  constructor(private dataSource: DataSource) {
    super(CreatedTask, dataSource.createEntityManager());
  }

  async createTask(user: UserPlatformType, createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    const { uid, userName, email } = user;
    const { title, description, location, date, time, privacy, type } = createdTaskDto;

    try {
      const result: CreatedTask = await this.create({
        uid,
        userName,
        email,
        title,
        description,
        color: type.color,
        location,
        date,
        time,
        privacy,
        type: type.type,
        createdDt: new Date(),
      }).save();

      this.logger.log(`Task successfully created: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async searchTask(user: UserPlatformType, searchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    const { uid, email } = user;
    const { startOfWeek, endOfWeek } = searchTaskDto;

    try {
      const result: CreatedTask[] = await this.find({
        where: { uid, date: Between(startOfWeek, endOfWeek) },
      });

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task searching process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async deleteTask(user: UserPlatformType, deleteTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
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

  async doneTask(user: UserPlatformType, doneTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    const { uid, email } = user;
    const { taskId } = doneTaskDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uid, taskId });

      if (result) {
        result.state = true;

        // TODO: change color when task finished
        // switch (result.type) {
        //   case TaskType.WORK:
        //     break;
        //   case TaskType.MEETING:
        //     break;
        //   case TaskType.PERSONAL:
        //     break;
        // }

        await this.save(result);

        return result;
      }
    } catch (err) {
      this.logger.log(`DB error occurred(Task deleting process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async findTaskById(user: UserPlatformType, createdTodoDto: CreatedTodoDto): Promise<CreatedTask> {
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

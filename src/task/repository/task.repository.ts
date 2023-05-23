import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatedTodoDto } from 'src/todo/dto/create-todo.dto';
import { Between, DataSource, Repository } from 'typeorm';
import { TaskCreateReqDto } from '../dto/task-create-req.dto';
import { TaskModifyReqDto } from '../dto/task-modify-req.dto';
import { TaskSearchReqDto } from '../dto/task-search-req.dto';
import { CreatedTask } from '../entity/created-task.entity';
import { UserPlatformType } from 'src/types/types';
import { binaryToUuid } from 'src/auth/util/uuid.util';
import { TaskResDto } from '../dto/task-res.dto';

@Injectable()
export class TaskRepository extends Repository<CreatedTask> {
  private logger: Logger = new Logger(TaskRepository.name);

  constructor(private dataSource: DataSource) {
    super(CreatedTask, dataSource.createEntityManager());
  }

  async createTask(user: UserPlatformType, taskCreateReqDto: TaskCreateReqDto): Promise<TaskResDto> {
    const { uuid, name, email } = user;
    const { title, description, location, date, time, privacy, type } = taskCreateReqDto;

    try {
      const result: CreatedTask = await this.create({
        uuid,
        name,
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

      const taskResDto: TaskResDto = new TaskResDto(
        result.taskId,
        binaryToUuid(result.uuid),
        result.name,
        result.email,
        result.title,
        result.description,
        result.color,
        result.location,
        result.date,
        result.time,
        result.privacy,
        result.type,
        result.createdDt,
        result.state,
        result.createdTodo,
      );

      this.logger.log(`Task successfully created: ${email}`);

      return taskResDto;
    } catch (err) {
      this.logger.log(`DB error occurred(Task saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async searchTask(user: UserPlatformType, taskSearchReqDto: TaskSearchReqDto): Promise<TaskResDto[]> {
    const { uuid, email } = user;
    const { startOfWeek, endOfWeek } = taskSearchReqDto;

    try {
      const result: CreatedTask[] = await this.find({
        where: { uuid, date: Between(startOfWeek, endOfWeek) },
      });

      const taskResDto: TaskResDto[] = result.map((value) => {
        return new TaskResDto(
          value.taskId,
          binaryToUuid(value.uuid),
          value.name,
          value.email,
          value.title,
          value.description,
          value.color,
          value.location,
          value.date,
          value.time,
          value.privacy,
          value.type,
          value.createdDt,
          value.state,
          value.createdTodo,
        );
      });

      return taskResDto;
    } catch (err) {
      this.logger.log(`DB error occurred(Task searching process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async deleteTask(user: UserPlatformType, taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    const { uuid, email } = user;
    const { taskId } = taskModifyReqDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uuid, taskId });

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

  async doneTask(user: UserPlatformType, taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    const { uuid, email } = user;
    const { taskId } = taskModifyReqDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uuid, taskId });

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
    const { email, uuid } = user;
    const { taskId } = createdTodoDto;

    try {
      const result: CreatedTask = await this.findOneBy({ uuid, taskId });

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task validating process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

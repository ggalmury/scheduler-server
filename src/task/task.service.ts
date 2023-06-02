import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskCreateReqDto } from './dto/task-create-req.dto';
import { TaskModifyReqDto } from './dto/task-modify-req.dto';
import { TaskSearchReqDto } from './dto/task-search-req.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskRepository } from './repository/task.repository';
import { UserPlatformType } from 'src/types/types';
import { TaskResDto } from './dto/task-res.dto';
import { TaskTodayDto } from './dto/task-today.dto';

@Injectable()
export class TaskService {
  private logger: Logger = new Logger(TaskService.name);
  constructor(private taskRepository: TaskRepository) {}

  async searchTodayTask(user: UserPlatformType, taskTodayDto: TaskTodayDto): Promise<TaskResDto[]> {
    const result: TaskResDto[] = await this.taskRepository.searchTodayTask(user, taskTodayDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async createTask(user: UserPlatformType, taskCreateReqDto: TaskCreateReqDto): Promise<TaskResDto> {
    return await this.taskRepository.createTask(user, taskCreateReqDto);
  }

  async searchTask(user: UserPlatformType, taskSearchReqDto: TaskSearchReqDto): Promise<TaskResDto[]> {
    const result: TaskResDto[] = await this.taskRepository.searchTask(user, taskSearchReqDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async deleteTask(user: UserPlatformType, taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.deleteTask(user, taskModifyReqDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async doneTask(user: UserPlatformType, taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.doneTask(user, taskModifyReqDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }
}

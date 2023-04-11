import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatedTaskDto } from './dto/create-task.dto';
import { DeleteOrDoneTaskDto } from './dto/delete-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskRepository } from './repository/task.repository';
import { UserPlatformType } from 'src/types/types';

@Injectable()
export class TaskService {
  private logger: Logger = new Logger(TaskService.name);
  constructor(private taskRepository: TaskRepository) {}

  async createTask(user: UserPlatformType, createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskRepository.createTask(user, createdTaskDto);
  }

  async searchTask(user: UserPlatformType, searchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    const result: CreatedTask[] = await this.taskRepository.searchTask(user, searchTaskDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async deleteTask(user: UserPlatformType, deleteTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.deleteTask(user, deleteTaskDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async doneTask(user: UserPlatformType, doneTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.doneTask(user, doneTaskDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }
}

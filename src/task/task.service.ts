import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { CreatedTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TaskService {
  private logger: Logger = new Logger(TaskService.name);
  constructor(private taskRepository: TaskRepository) {}

  async createTask(user: User, createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskRepository.createTask(user, createdTaskDto);
  }

  async searchTask(user: User): Promise<CreatedTask[]> {
    return await this.taskRepository.searchTask(user);
  }

  async deleteTask(user: User, deleteTaskDto: DeleteTaskDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.deleteTask(user, deleteTaskDto);

    if (!result) {
      this.logger.log(`Task not found: ${user.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }
}

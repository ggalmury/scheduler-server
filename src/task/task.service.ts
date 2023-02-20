import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatedTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TaskService {
  private logger: Logger = new Logger(TaskService.name);
  constructor(private taskRepository: TaskRepository) {}

  async createTask(createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskRepository.createTask(createdTaskDto);
  }

  async searchTask(searchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    return await this.taskRepository.getTask(searchTaskDto);
  }

  async deleteTask(deleteTaskDto: DeleteTaskDto): Promise<CreatedTask> {
    const result: CreatedTask = await this.taskRepository.dropTask(deleteTaskDto);

    if (!result) {
      this.logger.log(`Task not found: ${deleteTaskDto.email}`);
      throw new NotFoundException('Task not found');
    }

    return result;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { CreatedTaskDto } from './dto/task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TaskService {
  private logger: Logger = new Logger(TaskService.name);
  constructor(private taskRepository: TaskRepository) {}

  async createTask(createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskRepository.createTask(createdTaskDto);
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatedTask } from 'src/task/entity/created-task.entity';
import { TaskRepository } from 'src/task/repository/task.repository';
import { CreatedTodoDto } from './dto/create-todo.dto';
import { CreatedTodo } from './entity/created-todo.entity';
import { TodoRepository } from './repository/todo.repository';

@Injectable()
export class TodoService {
  private logger: Logger = new Logger(TodoService.name);

  constructor(private todoRepository: TodoRepository, private taskRepository: TaskRepository) {}

  async createTodo(createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    const task: CreatedTask = await this.taskRepository.validationTask(createdTodoDto);

    if (!task) {
      this.logger.log(`Task not found: ${createdTodoDto.email}`);
      throw new NotFoundException('Task not found');
    }

    return await this.todoRepository.createTodo(createdTodoDto);
  }
}

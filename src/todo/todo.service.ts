import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatedTask } from 'src/task/entity/created-task.entity';
import { TaskRepository } from 'src/task/repository/task.repository';
import { CreatedTodoDto } from './dto/create-todo.dto';
import { DeleteTodoDto } from './dto/delete-todo.dto';
import { CreatedTodo } from './entity/created-todo.entity';
import { TodoRepository } from './repository/todo.repository';
import { UserPlatformType } from 'src/types/types';

@Injectable()
export class TodoService {
  private logger: Logger = new Logger(TodoService.name);

  constructor(private todoRepository: TodoRepository, private taskRepository: TaskRepository) {}

  async createTodo(user: UserPlatformType, createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    const { email } = user;
    const task: CreatedTask = await this.taskRepository.findTaskById(user, createdTodoDto);

    if (!task) {
      this.logger.log(`Task not found: ${email}`);
      throw new NotFoundException('Task not found');
    }

    return await this.todoRepository.createTodo(user, createdTodoDto);
  }

  async deleteTodo(user: UserPlatformType, deleteTodoDto: DeleteTodoDto): Promise<CreatedTodo> {
    return await this.todoRepository.deleteTodo(user, deleteTodoDto);
  }
}

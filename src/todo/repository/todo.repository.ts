import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatedTodoDto } from '../dto/create-todo.dto';
import { DeleteTodoDto } from '../dto/delete-todo.dto';
import { CreatedTodo } from '../entity/created-todo.entity';

@Injectable()
export class TodoRepository extends Repository<CreatedTodo> {
  private logger: Logger = new Logger(TodoRepository.name);

  constructor(private dataSource: DataSource) {
    super(CreatedTodo, dataSource.createEntityManager());
  }

  async createTodo(user: User, createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    const { uid, email } = user;
    const { taskId, description, date } = createdTodoDto;

    try {
      const result: CreatedTodo = await this.create({
        uid,
        description,
        date,
        createdTask: { taskId },
      }).save();

      this.logger.log(`Todo successfully created: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Todo saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async deleteTodo(user: User, deleteTodoDto: DeleteTodoDto): Promise<CreatedTodo> {
    const { uid, email } = user;
    const { todoId } = deleteTodoDto;

    try {
      const result: CreatedTodo = await this.createQueryBuilder('createdTodo')
        .leftJoinAndSelect('createdTodo.createdTask', 'createdTask')
        .select(['createdTodo', 'createdTask.taskId'])
        .where({ uid, todoId })
        .getOne();

      if (result) {
        await this.remove(result);
      }

      result.todoId = todoId;

      this.logger.log(`Todo successfully deleted: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Todo deleting process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

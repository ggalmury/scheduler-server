import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatedTodoDto } from '../dto/create-todo.dto';
import { CreatedTodo } from '../entity/created-todo.entity';

@Injectable()
export class TodoRepository extends Repository<CreatedTodo> {
  private logger: Logger = new Logger(TodoRepository.name);

  constructor(private dataSource: DataSource) {
    super(CreatedTodo, dataSource.createEntityManager());
  }

  async createTodo(createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    const { uid, taskId, email, description } = createdTodoDto;

    try {
      const result: CreatedTodo = await this.create({
        uid,
        description,
        createdTask: { taskId },
      }).save();

      this.logger.log(`Todo successfully created: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Todo saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}

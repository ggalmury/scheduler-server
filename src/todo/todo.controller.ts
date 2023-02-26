import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { CreatedTodoDto } from './dto/create-todo.dto';
import { CreatedTodo } from './entity/created-todo.entity';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
  async createTodo(@Body() createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    return await this.todoService.createTodo(createdTodoDto);
  }
}

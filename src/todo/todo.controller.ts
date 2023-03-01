import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { ExtractUser } from 'src/decorator/extract-user.decorator';
import { CreatedTodoDto } from './dto/create-todo.dto';
import { DeleteTodoDto } from './dto/delete-todo.dto';
import { CreatedTodo } from './entity/created-todo.entity';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
  async createTodo(@ExtractUser() user: User, @Body() createdTodoDto: CreatedTodoDto): Promise<CreatedTodo> {
    return await this.todoService.createTodo(user, createdTodoDto);
  }

  @Post('delete')
  @UseGuards(JwtAccessTokenGuard)
  async deleteTodo(@ExtractUser() user: User, @Body() deleteTodoDto: DeleteTodoDto): Promise<CreatedTodo> {
    return await this.todoService.deleteTodo(user, deleteTodoDto);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from 'src/task/repository/task.repository';
import { TaskModule } from 'src/task/task.module';
import { TodoRepository } from './repository/todo.repository';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository]), TaskModule],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, TaskRepository],
})
export class TodoModule {}

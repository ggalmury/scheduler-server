import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './repository/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
  exports: [TaskRepository],
})
export class TaskModule {}

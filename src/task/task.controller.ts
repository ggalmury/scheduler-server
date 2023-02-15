import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { CreatedTaskDto } from './dto/task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/create')
  @UseGuards(JwtAccessTokenGuard)
  async create(@Body() createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskService.createTask(createdTaskDto);
  }

  // @Post('/delete')
  // @UseGuards(JwtAccessTokenGuard)
  // async delete(@Body() taskId: number): Promise<any> {
  //   return await this.taskService.deleteTask(taskId);
  // }
}

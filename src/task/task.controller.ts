import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { CreatedTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/create')
  @UseGuards(JwtAccessTokenGuard)
  async create(@Body() createdTaskDto: CreatedTaskDto): Promise<any> {
    // return await this.taskService.createTask(createdTaskDto);
  }
}

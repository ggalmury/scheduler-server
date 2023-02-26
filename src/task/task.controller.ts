import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { CreatedTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
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

  @Post('/list')
  @UseGuards(JwtAccessTokenGuard)
  async list(@Body() SearchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    return await this.taskService.searchTask(SearchTaskDto);
  }

  @Post('/delete')
  @UseGuards(JwtAccessTokenGuard)
  async delete(@Body() deleteTaskDto: DeleteTaskDto): Promise<CreatedTask> {
    return await this.taskService.deleteTask(deleteTaskDto);
  }
}

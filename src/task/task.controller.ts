import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { ExtractUser } from 'src/decorator/extract-user.decorator';
import { CreatedTaskDto } from './dto/create-task.dto';
import { DeleteOrDoneTaskDto } from './dto/delete-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskService } from './task.service';
import { UserPlatformType } from 'src/types/types';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
  async createTask(@ExtractUser() user: UserPlatformType, @Body() createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    return await this.taskService.createTask(user, createdTaskDto);
  }

  @Post('list')
  @UseGuards(JwtAccessTokenGuard)
  async searchTask(@ExtractUser() user: UserPlatformType, @Body() searchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    return await this.taskService.searchTask(user, searchTaskDto);
  }

  @Post('delete')
  @UseGuards(JwtAccessTokenGuard)
  async deleteTask(@ExtractUser() user: UserPlatformType, @Body() deleteTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    return await this.taskService.deleteTask(user, deleteTaskDto);
  }

  @Post('done')
  @UseGuards(JwtAccessTokenGuard)
  async doneTask(@ExtractUser() user: UserPlatformType, @Body() doneTaskDto: DeleteOrDoneTaskDto): Promise<CreatedTask> {
    return await this.taskService.doneTask(user, doneTaskDto);
  }
}

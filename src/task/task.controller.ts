import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';
import { ExtractUser } from 'src/decorator/extract-user.decorator';
import { TaskCreateReqDto } from './dto/task-create-req.dto';
import { TaskModifyReqDto } from './dto/task-modify-req.dto';
import { TaskSearchReqDto } from './dto/task-search-req.dto';
import { CreatedTask } from './entity/created-task.entity';
import { TaskService } from './task.service';
import { UserPlatformType } from 'src/types/types';
import { TaskResDto } from './dto/task-res.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
  async createTask(@ExtractUser() user: UserPlatformType, @Body() taskCreateReqDto: TaskCreateReqDto): Promise<TaskResDto> {
    return await this.taskService.createTask(user, taskCreateReqDto);
  }

  @Get('list')
  @UseGuards(JwtAccessTokenGuard)
  async searchTask(@ExtractUser() user: UserPlatformType): Promise<TaskResDto[]> {
    return await this.taskService.searchTask(user);
  }

  @Post('delete')
  @UseGuards(JwtAccessTokenGuard)
  async deleteTask(@ExtractUser() user: UserPlatformType, @Body() taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    return await this.taskService.deleteTask(user, taskModifyReqDto);
  }

  @Post('done')
  @UseGuards(JwtAccessTokenGuard)
  async doneTask(@ExtractUser() user: UserPlatformType, @Body() taskModifyReqDto: TaskModifyReqDto): Promise<CreatedTask> {
    return await this.taskService.doneTask(user, taskModifyReqDto);
  }
}

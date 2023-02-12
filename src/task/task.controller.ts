import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access.guard';

@Controller('task')
export class TaskController {
  @Post('/create')
  @UseGuards(JwtAccessTokenGuard)
  async createTask(): Promise<string> {
    // TODO: implement logics about regenerate each tokens, remove token when refresh token expired
    // implement task creating logic

    return 'access valid';
  }
}

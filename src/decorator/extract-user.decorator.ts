import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';

export const ExtractUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const request: any = ctx.switchToHttp().getRequest();

  return request.user;
});

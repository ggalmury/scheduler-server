import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPlatformType } from 'src/types/types';

export const ExtractUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserPlatformType => {
  const request: any = ctx.switchToHttp().getRequest();

  return request.user;
});

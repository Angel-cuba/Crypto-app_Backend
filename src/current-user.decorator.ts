import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserbyContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserbyContext(context),
);

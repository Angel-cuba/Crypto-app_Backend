import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/current-user.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserResponse } from '../users/dto/response/user-response.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    this.auth.login(user, response);
    response.send(user);
  }
}

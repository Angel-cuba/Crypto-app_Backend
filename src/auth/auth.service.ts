import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserResponse } from 'src/users/dto/response/user-response.dto';

@Injectable()
export class AuthService {
  async login(user: UserResponse, response: Response): Promise<void> {
    response.cookie('token', user._id, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}

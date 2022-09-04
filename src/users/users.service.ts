import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/request/create-user-request';
import { UsersRepository } from './user.repository';
import { hash } from 'bcrypt';
import { User } from './models/Users';
import { UserResponse } from './dto/response/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(createUserRequest: CreateUserRequest): Promise<any> {
    await this.validateUser(createUserRequest);

    const user = await this.usersRepository.insertOne({
      ...createUserRequest,
      password: await hash(createUserRequest.password, 10),
    });
    return this.buildResponse(user);
  }
  //Method to build the response
  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id.toHexString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
  //Method to validate if user exists
  private async validateUser(
    createUserRequest: CreateUserRequest,
  ): Promise<void> {
    const checkUser = await this.usersRepository.findUserByEmail(
      createUserRequest.email,
    );
    if (checkUser) {
      throw new BadRequestException(
        'This email is already in use, please try again',
      );
    }
  }
}

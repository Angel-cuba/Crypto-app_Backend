import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/request/create-user-request';
import { UsersRepository } from './user.repository';
import { hash, compare } from 'bcrypt';
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
  //Method to validate user by  email and password
  async validateUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserResponse> {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User doesn't exist by email ${email}`);
    }
    // const isPasswordValid = await user.validatePassword(password);
    // if (!isPasswordValid) {
    //   throw new BadRequestException('Invalid email or password');
    // }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.buildResponse(user);
  }
}

import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<IUser>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return await newUser.save();
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      throw new InternalServerErrorException();
    }

    // const createdUser = new this.userModel(createUserDto);
    // return createdUser.save();
  }

  async getUsers(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  // async updateUser(id: string, updateUserDto: any): Promise<IUser> {
  //   return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  // }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
  // private users = [
  //   { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  //   { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  // ];

  // getUsers() {
  //   return this.users;
  // }

  // createUser(user: CreateUserDto) {
  //   return {
  //     ...user,
  //     id: this.users.length + 1,
  //   }
  // }
}

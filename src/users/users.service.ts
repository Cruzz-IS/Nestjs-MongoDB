import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  getUsers() {
    return this.users;
  }

  createUser(user: CreateUserDto) {
    return {
      ...user,
      id: this.users.length + 1,
    }
  }
}

// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   getUsers() {
//     return this.prisma.user.findMany();
//   }

//   createUser(user: CreateUserDto) {
//     return this.prisma.user.create({ data: user });
//   }
// }

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('users') //Aqui se le asigna la etiqueta de users a esta ruta para que se muestre en la documentacion de swagger
  @Get('')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('')
  @ApiTags('users')
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  // @ApiTags('users') //Aqui se le asigna la etiqueta de users a esta ruta para que se muestre en la documentacion de swagger
  // @Get('')
  // getUsers() {
  //   return this.usersService.getUsers();
  // }

  // @Post('')
  // @ApiTags('users')
  // createUser(@Body() user: CreateUserDto) {
  //   return this.usersService.createUser(user);
  // }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user-dto';
import { JWTAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('users') //Aqui se le asigna la etiqueta de users a esta ruta para que se muestre en la documentacion de swagger
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @Get('')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('users')
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @ApiTags('users')
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @ApiTags('users')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @ApiTags('users')
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.updateUser(id, updateUserDto);
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

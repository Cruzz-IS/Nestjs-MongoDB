import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<IUser>) {}

  private async hashData(data: string) {
    return await argon2.hash(data);
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      // Argon2.hash genera automáticamente el salt y lo incluye en el hash final
      const hashedPassword = await this.hashData(createUserDto.password);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      return await newUser.save();
    } catch (error: any) {
      // Mantenemos tu excelente manejo de errores de MongoDB
      if (error && error.code === 11000) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  // creacion de usuario con la dependencia de bycrypt para el hash de la contraseña y manejo de errores específicos de MongoDB para evitar duplicados
  // async createUser(createUserDto: CreateUserDto): Promise<IUser> {
  //   try {
  //     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  //     const newUser = new this.userModel({
  //       ...createUserDto,
  //       password: hashedPassword,
  //     });
  //     return await newUser.save();
  //   } catch (error: any) {
  //     // Usamos any para capturar la estructura del error de Mongo
  //     // Verificamos directamente el código 11000
  //     if (error && error.code === 11000) {
  //       throw new ConflictException('El correo electrónico ya está registrado');
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }

  async getUsers(): Promise<IUser[]> {
    return this.userModel.find().lean().exec();
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const updateData = { ...updateUserDto };
    // if (updateData.password) {
    //   updateData.password = await bcrypt.hash(updateData.password, 10);
    // }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async removeUser(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Usuario no encontrado');
    return { deleted: true };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    // Si pasamos null seria el (logout) donde borramos el token. Si no, lo hasheamos.
    const hashedRefreshToken = refreshToken
      ? await this.hashData(refreshToken)
      : null;

    return this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}

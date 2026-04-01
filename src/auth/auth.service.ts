import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Limpieza segura del objeto usuario para evitar exponer la contraseña
    const userObj = user.toObject ? user.toObject() : user;

    // Eliminamos la contraseña del objeto que devolveremos
    const { password: _, ...result } = userObj;
    return result;
  }

  async signIn(user: any): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  // async register(name: string, email: string, password: string) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   return this.usersService.createUser(name, email, hashedPassword);
  // }

  //   async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(email);
  //   if (!user) {
  //     throw new UnauthorizedException('Credenciales inválidas');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Credenciales inválidas');
  //   }

  //   // Limpieza segura del objeto usuario para evitar exponer la contraseña
  //   const userObj = user.toObject ? user.toObject() : user;

  //   // Eliminamos la contraseña del objeto que devolveremos
  //   const { password: _, ...result } = userObj;
  //   return result;
  // }

  // async signIn(user: any): Promise<{ access_token: string }> {
  //   const payload = { sub: user._id, email: user.email, role: user.role };
  //   return {
  //     access_token: await this.jwtService.sign(payload),
  //   };
  // }

  // async getTokens(userId: string, email: string) {
  //   const [at, rt] = await Promise.all([
  //     this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '15m' }),
  //     this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '7d' }),
  //   ]);
  //   return { access_token: at, refresh_token: rt };
  // }

  // async refreshTokens(userId: string, rt: string) {
  //   const user = await this.usersService.getUser(userId);
  //   if (!user || !(user as any).refreshTokenHash)
  //     throw new ForbiddenException('Access Denied');

  //   const rtMatches = await bcrypt.compare(rt, (user as any).refreshTokenHash);
  //   if (!rtMatches) throw new ForbiddenException('Access Denied');

  //   const tokens = await this.getTokens(user._id.toString(), user.email);
  //   await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
  //   return tokens;
  // }

  // async updateRefreshToken(userId: string, rt: string) {
  //   const hash = await bcrypt.hash(rt, 10);
  //   await this.usersService.updateUser(userId, {
  //     refreshTokenHash: hash,
  //   } as any);
  // }

  async logout(userId: string) {
    // Borramos el hash del refresh token
    return this.usersService.updateUser(userId, { refreshTokenHash: null } as any);
  }
}

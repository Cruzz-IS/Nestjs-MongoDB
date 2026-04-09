import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Credenciales inválidas');
    // }

    // Limpieza segura del objeto usuario para evitar exponer la contraseña
    const userObj = user.toObject ? user.toObject() : user;

    // Eliminamos la contraseña del objeto que devolveremos
    const { password: _, refreshToken: __, ...result } = userObj;
    return result;
  }

  async signIn(user: any) {
    const tokens = await this.getTokens(user._id.toString(), user.email);

    // Esto llamará al método que acabamos de modificar arriba
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return { tokens, user };
    // const payload = { sub: user._id, email: user.email, role: user.role };
    // return {
    //   access_token: await this.jwtService.sign(payload),
    // };
  }

  async signUp(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);

    const tokens = await this.getTokens(newUser._id.toString(), newUser.email);

    // Guardamos el refresh token hasheado en la BD
    await this.usersService.updateRefreshToken(
      newUser._id.toString(),
      tokens.refreshToken,
    );

    return tokens;
  }

  async logout(userId: string) {
    // Ponemos el refresh token en null para invalidar la sesión
    return this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser(userId);
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acceso denegado: No hay sesión activa');
    }

    if (!user.refreshToken.startsWith('$')) {
      throw new UnauthorizedException('Error interno: Hash de sesión inválido');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acceso denegado: Token no coincide');
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return tokens;
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}

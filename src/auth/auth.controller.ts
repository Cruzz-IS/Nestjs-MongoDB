import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard } from './guards/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      return await this.authService.signIn(user);
    } catch (error) {
      console.error('ERROR EN EL LOGIN:', error);
      throw error;
    }
  }

  @UseGuards(JWTAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @UseGuards(JWTAuthGuard)
  @Get('logout')
  logout(@Req() req: any) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // // @UseGuards(JWTAuthGuard)
  // // @Get('profile')
  // // getProfile(@Request() req) {
  // //   return req.user;
  // // }

  // @UseGuards(JWTAuthGuard)
  // @Post('logout')
  // async logout(
  //   @Req() req: any,
  //   @Res({ passthrough: true }) res: express.Response,
  // ) {
  //   await this.authService.logout(req.user.sub);
  //   res.clearCookie('refresh_token'); // Limpiar la cookie del navegador
  //   return { message: 'Logged out successfully' };
  // }
}

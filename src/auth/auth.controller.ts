import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard } from './guards/auth.guard';

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

  //   @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async signIn(
  //   @Body() loginDto: LoginDto,
  //   @Res({ passthrough: true }) res: express.Response,
  // ) {
  //   try {
  //     const user = await this.authService.validateUser(
  //       loginDto.email,
  //       loginDto.password,
  //     );
  //     const tokens = await this.authService.getTokens(user._id, user.email);

  //     await this.authService.updateRefreshToken(user._id, tokens.refresh_token);
  //     res.cookie('refresh_token', tokens.refresh_token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //       maxAge: 7 * 24 * 60 * 60 * 1000,
  //     });

  //     return {
  //       access_token: tokens.access_token,
  //       userId: user._id,
  //     };
  //   } catch (error) {
  //     console.error('ERROR EN LOGIN:', error);
  //     throw error;
  //   }
  // }

  // @Post('refresh')
  // async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
  //   const refreshToken = req.cookies['refresh_token'];
  //   if (!refreshToken) throw new UnauthorizedException();
  // }

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

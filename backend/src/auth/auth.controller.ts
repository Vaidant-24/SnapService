import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    [key: string]: any;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const { token, user } = await this.authService.login(loginUserDto);

    // Set JWT as HTTP-only cookie
    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
      path: '/',
    });

    return { message: 'Login successful', user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // Clear the authentication cookie
    response.clearCookie('Authentication', {
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user['userId']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@Req() req: AuthenticatedRequest) {
    return { valid: true, user: req.user };
  }
}

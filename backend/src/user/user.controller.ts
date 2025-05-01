import {
  Controller,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCustomerDto } from './dto-user/customer.dto';
import { UpdateProviderDto } from './dto-user/service-provider-dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // PATCH /user/profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: UpdateCustomerDto | UpdateProviderDto) {
    const user = req.user;
    // console.log('User from request:', user);

    if (!user || !user.userId) {
      throw new BadRequestException('Invalid user');
    }

    if (user.role === 'customer') {
      return this.userService.updateCustomerProfile(user.userId, body as UpdateCustomerDto);
    }

    if (user.role === 'service_provider') {
      return this.userService.updateProviderProfile(user.userId, body as UpdateProviderDto);
    }

    throw new BadRequestException('Unsupported role for profile update');
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-pic')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) throw new BadRequestException('Invalid user');
    return this.userService.uploadProfilePicToCloudinary(userId, file);
  }
}

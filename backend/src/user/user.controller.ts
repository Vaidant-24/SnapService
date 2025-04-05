import { Controller, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCustomerDto } from './dto-user/customer.dto';
import { UpdateProviderDto } from './dto-user/service-provider-dto';

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
}

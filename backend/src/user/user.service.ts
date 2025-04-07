import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UpdateCustomerDto } from './dto-user/customer.dto';
import { UpdateProviderDto } from './dto-user/service-provider-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateCustomerProfile(userId: string, dto: UpdateCustomerDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
        },
      },
      { new: true },
    );
    // console.log('Updated user:', updatedUser);

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateProviderProfile(userId: string, dto: UpdateProviderDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          serviceCategory: dto.serviceCategory,
          experience: dto.experience,
          description: dto.description,
        },
      },
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }
}

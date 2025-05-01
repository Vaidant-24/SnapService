import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UpdateCustomerDto } from './dto-user/customer.dto';
import { UpdateProviderDto } from './dto-user/service-provider-dto';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('CLOUDINARY') private cloudinary: typeof Cloudinary,
  ) {}

  async uploadProfilePicToCloudinary(userId: string, file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'profile-pics',
          public_id: `user-${userId}`,
          overwrite: true,
        },
        async (error, result) => {
          if (error) return reject(error);

          const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { profileImage: result?.secure_url },
            { new: true },
          );

          resolve({ profileImage: result?.secure_url, user: updatedUser });
        },
      );
      stream.end(file.buffer);
    });
  }

  async updateCustomerProfile(userId: string, dto: UpdateCustomerDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          location: dto.location,
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
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          location: dto.location,
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

import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../user/dto-user/create-user.dto';
import { LoginUserDto } from '../user/dto-user/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // register-
  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    // Check if user with email already exists
    const emailExists = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const createdUser = new this.userModel(createUserDto);

    await createdUser.save();

    return { message: 'User registered successfully' };
  }

  // login -
  async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: any }> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      location: user.location,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    // console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      location: user.location,
      experience: user.experience,
      description: user.description,
      createdAt: user.createdAt,
    };
  }

  async verifyToken(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return !!user;
  }
}

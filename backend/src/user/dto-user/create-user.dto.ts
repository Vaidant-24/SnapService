import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsEnum(['customer', 'service_provider'])
  role: string;

  @IsNotEmpty()
  address: string;

  // Service Provider Specific Fields
  @IsOptional()
  @IsNotEmpty()
  serviceCategory?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}

import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MinLength, IsNumber, ValidateNested } from 'class-validator';
import { GeoLocationDto } from './service-provider-dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

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
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}

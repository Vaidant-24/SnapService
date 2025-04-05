// user/dto/base-user-update.dto.ts
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class BaseUserUpdateDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

// user/dto/update-provider.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { BaseUserUpdateDto } from './base-user-dto';

export class UpdateProviderDto extends PartialType(BaseUserUpdateDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

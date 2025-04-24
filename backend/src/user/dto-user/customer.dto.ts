// user/dto/update-customer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { BaseUserUpdateDto } from './base-user-dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GeoLocationDto } from './service-provider-dto';

export class UpdateCustomerDto extends PartialType(BaseUserUpdateDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;
}

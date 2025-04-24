import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsInt, Min, IsArray, IsIn, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseUserUpdateDto } from './base-user-dto';

export class GeoLocationDto {
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  coordinates: [number, number]; // [longitude, latitude]
}

export class UpdateProviderDto extends PartialType(BaseUserUpdateDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;
}

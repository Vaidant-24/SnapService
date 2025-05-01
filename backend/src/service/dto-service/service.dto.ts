import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsMongoId, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { GeoLocationDto } from 'src/user/dto-user/service-provider-dto';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsMongoId()
  providerId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location: GeoLocationDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location: GeoLocationDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;
}

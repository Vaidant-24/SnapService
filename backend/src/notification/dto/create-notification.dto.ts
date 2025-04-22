import { IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsBoolean, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  recipientId: string;

  @IsEnum(['BookingUpdate', 'AwaitingApproval', 'ReviewSubmitted', 'System'])
  @IsNotEmpty()
  type: string;

  @IsMongoId()
  @IsOptional()
  bookingId?: string;

  @IsMongoId()
  @IsOptional()
  serviceId?: string;

  @IsMongoId()
  @IsOptional()
  senderId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

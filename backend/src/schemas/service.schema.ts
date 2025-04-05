import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  totalBookings?: number; // Count of how many times this service has been booked

  @Prop({ default: 0 })
  rating?: number; // Average rating for the specific service

  @Prop({ default: 0 })
  reviewCount?: number; // Number of reviews for the specific service

  @Prop()
  image?: string; // Optional image URL or filename for service
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

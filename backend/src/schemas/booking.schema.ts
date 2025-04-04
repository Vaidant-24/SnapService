import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId; // Customer who booked the service

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId; // Service provider

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId; // Service being booked

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] })
  status: string; // Booking status

  @Prop({ default: false })
  isPaid: boolean; // Payment status
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

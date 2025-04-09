import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerDetails: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  customerAddress: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] })
  status: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: 0 })
  amountPaid?: number; // Total amount paid for the booking

  @Prop({ default: 'Cash', enum: ['Cash', 'Online', 'UPI', 'Card'] })
  paymentMethod?: string; // Optional: payment mode

  @Prop({ default: '' })
  customerNote?: string; // Any extra instruction from customer

  @Prop({ default: '' })
  providerNote?: string; // Internal notes added by provider (e.g., reschedule reason)

  @Prop({ default: false })
  isRated?: boolean; // Whether the customer has rated the booking

  @Prop({ default: 0 })
  rating?: number; // Rating given by customer

  @Prop()
  review?: string; // Optional review by customer
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

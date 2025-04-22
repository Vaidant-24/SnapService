// schemas/review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: string;

  @Prop({ required: true })
  providerId: string;

  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  serviceId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

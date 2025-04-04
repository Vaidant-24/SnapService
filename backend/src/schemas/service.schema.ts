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
  price: number; // Base price

  @Prop({ required: true })
  category: string; // Example: Plumbing, Cleaning

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId; // Reference to service provider

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  providerId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

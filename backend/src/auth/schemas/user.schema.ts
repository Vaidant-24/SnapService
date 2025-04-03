import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    validatePassword(password: string): Promise<boolean>;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: 'customer', enum: ['customer', 'service_provider', 'admin'] })
  role: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  serviceCategory?: string;

  @Prop()
  experience?: number;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Password Hashing Pre-save Hook
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

// Method for Password Validation
UserSchema.methods.validatePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

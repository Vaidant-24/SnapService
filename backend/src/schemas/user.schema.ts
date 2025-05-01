import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    validatePassword(password: string): Promise<boolean>;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: false })
  firstName: string;

  @Prop({ required: true, unique: false })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: 'customer', enum: ['customer', 'service_provider'] })
  role: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  // Service Provider Specific Fields

  @Prop()
  experience?: number;

  @Prop()
  description?: string;

  @Prop()
  profileImage?: string; // URL or filename for provider profile picture

  @Prop({ default: 0 })
  totalBookings?: number; // Track how many bookings a provider has completed

  @Prop({ default: 0 })
  rating?: number; // Average rating out of 5

  @Prop({ default: 0 })
  reviewCount?: number; // How many reviews the provider has received

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ location: '2dsphere' });

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

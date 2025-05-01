import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceService } from './service/service.service';
import { ServiceController } from './service/service.controller';
import { BookingService } from './booking/booking.service';
import { BookingController } from './booking/booking.controller';
import { Service, ServiceSchema } from './schemas/service.schema';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { ReviewModule } from './review/review.module';
import { NotificationsGateway } from './socketIO/notifications.gateway';
import { NotificationModule } from './notification/notification.module';
import { Review, ReviewSchema } from './schemas/review.schema';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ReviewModule,
    NotificationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoDbUri = configService.get<string>('MONGODB_URI');
        return {
          uri: mongoDbUri,
        };
      },

      inject: [ConfigService],
    }),
    CloudinaryModule,
  ],
  providers: [ServiceService, BookingService, UserService, NotificationsGateway],
  controllers: [ServiceController, BookingController, UserController],
})
export class AppModule {}

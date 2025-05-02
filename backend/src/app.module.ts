import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ServiceModule } from './service/service.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { SocketIOModule } from './socket-io/socket-io.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    ServiceModule,
    BookingModule,
    UserModule,
    ReviewModule,
    NotificationModule,
    CloudinaryModule,
    SocketIOModule,
  ],
  providers: [],
})
export class AppModule {}

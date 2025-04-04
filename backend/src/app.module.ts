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

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
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
  ],
  providers: [ServiceService, BookingService],
  controllers: [ServiceController, BookingController],
})
export class AppModule {}

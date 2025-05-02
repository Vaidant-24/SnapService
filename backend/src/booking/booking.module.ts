// booking.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/schemas/booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

import { NotificationModule } from 'src/notification/notification.module';
import { SocketIOModule } from 'src/socket-io/socket-io.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    NotificationModule,
    SocketIOModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

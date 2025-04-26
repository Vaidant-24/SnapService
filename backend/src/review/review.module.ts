// review.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { NotificationsGateway } from 'src/socketIO/notifications.gateway';
import { Service, ServiceSchema } from 'src/schemas/service.schema';
import { ServiceService } from 'src/service/service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, NotificationsGateway, ServiceService],
  exports: [ReviewService],
})
export class ReviewModule {}

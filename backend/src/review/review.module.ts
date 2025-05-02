import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { NotificationsGateway } from 'src/socket-io/notifications.gateway';
import { ServiceModule } from 'src/service/service.module'; // import ServiceModule instead

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]), ServiceModule],
  controllers: [ReviewController],
  providers: [ReviewService, NotificationsGateway],
  exports: [ReviewService],
})
export class ReviewModule {}

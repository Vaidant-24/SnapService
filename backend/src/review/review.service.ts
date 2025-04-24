// review.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { CreateReviewDto } from './dto-review/create-review.dto';
import { NotificationsGateway } from 'src/socketIO/notifications.gateway';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async addReview(dto: CreateReviewDto): Promise<Review> {
    const created = new this.reviewModel(dto);
    return created.save();
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('customerId', 'firstName lastName')
      .populate('providerId', 'firstName lastName')
      .exec();
  }

  async getReviewsByProvider(providerId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({ providerId, isRead: false })
      .populate('customerId', 'firstName lastName ')
      .exec();
  }

  async markAllReviewsAsRead(providerId: string): Promise<{ modifiedCount: number }> {
    const result = await this.reviewModel.updateMany({ providerId, isRead: false }, { $set: { isRead: true } });
    console.log('Updated reviews:', result);

    return { modifiedCount: result.modifiedCount };
  }
}

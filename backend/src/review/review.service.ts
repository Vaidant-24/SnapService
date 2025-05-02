import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { CreateReviewDto } from './dto-review/create-review.dto';
import { NotificationsGateway } from 'src/socket-io/notifications.gateway';
import { ServiceService } from '../service/service.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly serviceService: ServiceService,
  ) {}

  async addReview(dto: CreateReviewDto): Promise<void> {
    const created = new this.reviewModel(dto);
    const savedReview = await created.save();

    // Update service ratings
    await this.serviceService.updateServiceRatings(dto.serviceId);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('customerId', 'firstName lastName')
      .populate('providerId', 'firstName lastName')
      .exec();
  }

  async getunreadReviewsByProvider(providerId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({ providerId, isRead: false })
      .populate('customerId', 'firstName lastName ')
      .limit(6)
      .exec();
  }

  async getReviewsByProvider(providerId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({ providerId })
      .populate('customerId', 'firstName lastName ')
      .sort({ createdAt: -1 })
      .limit(6)
      .exec();
  }

  async markAllReviewsAsRead(providerId: string): Promise<{ modifiedCount: number }> {
    const result = await this.reviewModel.updateMany({ providerId, isRead: false }, { $set: { isRead: true } });
    console.log('Updated reviews:', result);

    return { modifiedCount: result.modifiedCount };
  }

  // Add a method to get reviews by serviceId
  async getReviewsByService(serviceId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ serviceId })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }
}

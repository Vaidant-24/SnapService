// review.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { CreateReviewDto } from './dto-review/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
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
    return this.reviewModel.find({ providerId }).populate('customerId', 'firstName lastName ').exec();
  }
}

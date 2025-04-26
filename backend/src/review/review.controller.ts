import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto-review/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.addReview(dto);
  }

  @Get()
  async getAll() {
    return this.reviewsService.getAllReviews();
  }

  @Get('/provider/:id')
  async getReviews(@Param('id') providerId: string) {
    return this.reviewsService.getReviewsByProvider(providerId);
  }

  @Get('/service/:id')
  async getReviewsByService(@Param('id') serviceId: string) {
    return this.reviewsService.getReviewsByService(serviceId);
  }

  @Patch('/mark-read/:providerId')
  async markAllReviewsAsRead(@Param('providerId') providerId: string) {
    return this.reviewsService.markAllReviewsAsRead(providerId);
  }
}

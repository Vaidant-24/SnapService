import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from 'src/schemas/service.schema';
import { CreateServiceDto, UpdateServiceDto } from './dto-service/service.dto';
import { Review } from 'src/schemas/review.schema';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find({ isActive: true }).populate('providerId', 'firstName lastName email phone address');
  }

  async findFeaturedService() {
    return this.serviceModel.find({ isActive: true, averageRating: { $gte: 3.5 } });
  }

  async findById(serviceId: string): Promise<Service> {
    const service = await this.serviceModel
      .findById(serviceId)
      .populate('providerId', 'firstName lastName email phone address experience');
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async findAllServicesByProvider(providerId: string, limit?: string): Promise<Service[]> {
    const query = this.serviceModel
      .find({ providerId })
      .populate('providerId', 'firstName lastName email phone address')
      .sort({ createdAt: -1 });

    if (limit) {
      query.limit(Number(limit));
    }

    const services = await query.exec();

    if (!services || services.length === 0) {
      throw new NotFoundException('No services found for the given provider ID');
    }

    return services;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const newService = new this.serviceModel(createServiceDto);
    return newService.save();
  }

  async update(serviceId: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const updatedService = await this.serviceModel.findByIdAndUpdate(serviceId, updateServiceDto, { new: true });
    if (!updatedService) throw new NotFoundException('Service not found');
    return updatedService;
  }

  async delete(serviceId: string): Promise<Service> {
    const deletedService = await this.serviceModel.findByIdAndDelete(serviceId);
    if (!deletedService) throw new NotFoundException('Service not found');
    return deletedService;
  }

  async findNearbyServices(lng: number, lat: number, radius: number) {
    return this.serviceModel.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      },
    });
  }

  async updateServiceRatings(serviceId: string): Promise<Service> {
    // Find all reviews for this service
    const reviews = await this.reviewModel.find({ serviceId });

    let averageRating = 0;
    let reviewCount = reviews.length;

    if (reviewCount > 0) {
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
    }

    // Update the service with the new ratings data
    const updatedService = await this.serviceModel.findByIdAndUpdate(
      serviceId,
      { averageRating, reviewCount },
      { new: true },
    );

    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    return updatedService;
  }

  // Method to update all services' ratings (for initial migration)
  async updateAllServicesRatings(): Promise<void> {
    const services = await this.serviceModel.find();

    for (const service of services) {
      await this.updateServiceRatings(service._id.toString());
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from 'src/schemas/service.schema';
import { CreateServiceDto, UpdateServiceDto } from './dto-service/service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) {}

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find({ isActive: true }).populate('providerId', 'username email');
  }

  async findById(serviceId: string): Promise<Service> {
    const service = await this.serviceModel
      .findById(serviceId)
      .populate('providerId', 'username email phone address experience');
    if (!service) throw new NotFoundException('Service not found');
    return service;
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
}

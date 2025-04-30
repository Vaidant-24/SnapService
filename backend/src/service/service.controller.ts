// service.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto-service/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('nearby')
  async getNearbyServices(
    @Query('lng') lng: number,
    @Query('lat') lat: number,
    @Query('radius') radius: number, // default to 5 km
  ) {
    return this.serviceService.findNearbyServices(lng, lat, radius);
  }

  @Get('provider/:providerId')
  async getAllServicesByProvider(
    @Param('providerId') providerId: string,
    @Query('limit') limit?: string, // optional query param
  ) {
    return this.serviceService.findAllServicesByProvider(providerId, limit);
  }

  @Get('featured-services')
  async getFeaturedServices() {
    return this.serviceService.findFeaturedService();
  }

  @Get()
  async getAllServices(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radius') radius?: number,
    @Query('page') page = '1',
    @Query('limit') limit = '8',
  ) {
    return this.serviceService.findAllWithFilters({
      category,
      search,
      sortBy,
      sortOrder,
      lat,
      lng,
      radius: radius || 10,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.serviceService.findById(id);
  }

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Put('update-all-rating')
  async updateServiceRatings() {
    return this.serviceService.updateAllServicesRatings();
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.serviceService.delete(id);
  }
}

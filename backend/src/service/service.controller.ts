import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto-service/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getAllServices() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.serviceService.findById(id);
  }

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
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

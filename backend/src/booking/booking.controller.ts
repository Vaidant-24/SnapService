import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto-booking/booking.dto';

export interface QueryParams {
  status?: string;
  customerId?: string;
}
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('customer/:customerId')
  async getBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.findAllByCustomer(customerId);
  }

  @Get('provider/:providerId')
  async getBookingsByProvider(@Param('providerId') providerId: string) {
    return this.bookingService.findAllByProvider(providerId);
  }

  @Get('filterByStatus')
  async getBookingsByQuery(@Query() query: QueryParams) {
    return this.bookingService.findBookingByQuery(query);
  }

  @Get()
  async getAllBookings() {
    return this.bookingService.findAllBookings();
  }

  @Get(':status')
  async getBookingsByStatus(@Param('status') status: string) {
    return this.bookingService.findBookingByStatus(status);
  }

  @Get(':bookingId')
  async getBookingById(@Param('bookingId') id: string) {
    return this.bookingService.findBookingById(id);
  }

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }
}

import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto-booking/booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('customer/:customerId')
  async getBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.findAllByCustomer(customerId);
  }

  // @Get('provider/:providerId')
  // async getBookingsByProvider(@Param('providerId') providerId: string) {
  //   return this.bookingService.findAllByProvider(providerId);
  // }

  @Get()
  async getAllBookings() {
    return this.bookingService.findAllBookings();
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto, UpdateBookingDto } from './dto-booking/booking.dto';
import { Booking, BookingDocument } from 'src/schemas/booking.schema';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async findAllByCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ customerId })
      .populate('serviceId', 'name description price')
      .populate('providerDetails', 'firstName lastName email phone');
  }

  // async findAllByProvider(providerId: string): Promise<Booking[]> {
  //   return this.bookingModel
  //     .find({ providerId })
  //     .populate('serviceId', 'name description price')
  //     .populate('providerDetails', 'username email');
  // }

  async findAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find();
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);
    return newBooking.save();
  }

  async update(bookingId: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const updatedBooking = await this.bookingModel.findByIdAndUpdate(bookingId, updateBookingDto, { new: true });
    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return updatedBooking;
  }
}

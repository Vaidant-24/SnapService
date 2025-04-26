// booking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto, UpdateBookingDto } from './dto-booking/booking.dto';
import { Booking, BookingDocument } from 'src/schemas/booking.schema';
import { QueryParams } from './booking.controller';
import { NotificationsGateway, NotificationEvent } from 'src/socketIO/notifications.gateway';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationService: NotificationService,
  ) {}

  async findAllByCustomerAndStatus(customerId: string): Promise<Booking[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.bookingModel
      .find({ customerId, status: 'Confirmed', date: { $gte: today } })
      .populate('serviceId', 'name description price')
      .populate('providerDetails', 'firstName lastName email phone')

      .sort({ date: 1 })
      .limit(5);
  }

  async findAllByProviderAndStatus(providerId: string): Promise<Booking[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.bookingModel
      .find({
        'providerDetails._id': providerId,
        status: 'Confirmed',
        date: { $gte: today }, // Only bookings for today or later
      })
      .populate('serviceId', 'name description price')
      .populate('providerDetails', 'username email')
      .sort({ date: 1 }) // Sort by booking date (earliest first)
      .limit(5); // Limit to top 5
  }

  async findAllByCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ customerId })
      .populate('serviceId', 'name description price')
      .populate('providerDetails', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
  }

  async findAllByProvider(providerId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ 'providerDetails._id': providerId })
      .populate('serviceId', 'name description price')
      .populate('providerDetails', 'username email')
      .sort({ createdAt: -1 });
  }

  async findAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find().sort({ createdAt: -1 });
  }

  async findBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ _id: bookingId });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }

  async findBookingByStatus(status: string): Promise<Booking[]> {
    const booking = await this.bookingModel.find({ status });
    if (!booking) {
      throw new NotFoundException(`Booking with status ${status} not found`);
    }
    return booking;
  }

  async findBookingByQuery(query: QueryParams): Promise<Booking[]> {
    const booking = await this.bookingModel.find({ status: query.status, customerId: query.customerId });
    if (!booking) {
      throw new NotFoundException(`Booking with query ${query} not found`);
    }
    return booking;
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);
    const providerId = createBookingDto.providerDetails._id;
    if (providerId) {
      await this.notificationService.createNotification({
        type: 'BookingUpdate',
        message: `A customer booked your service - ${newBooking.serviceName}`,
        senderId: createBookingDto.customerId,
        serviceId: createBookingDto.serviceId,
        recipientId: providerId,
        bookingId: (newBooking._id as string).toString(),
        isRead: false,
      });
      await this.notificationsGateway.ProviderBookedByCustomer(providerId);
    }
    return newBooking.save();
  }

  async update(bookingId: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const updatedBooking = await this.bookingModel.findByIdAndUpdate(bookingId, updateBookingDto, { new: true });

    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const customerId = updatedBooking.customerId?.toString();
    const providerId = updatedBooking.providerDetails?._id?.toString();

    switch (updateBookingDto.status) {
      case 'Awaiting Completion':
        if (customerId) {
          await this.notificationService.createNotification({
            type: 'BookingUpdate',
            message: 'Your booking is Awaiting Completion',
            senderId: providerId,
            serviceId: updatedBooking.serviceId.toString(),
            recipientId: customerId,
            bookingId: bookingId,
            isRead: false,
          });

          await this.notificationsGateway.customerBookingCompletionApproval(customerId);
        }
        break;
      case 'Cancelled':
        if (customerId) {
          await this.notificationService.createNotification({
            type: 'BookingUpdate',
            message: 'Your booking has been cancelled',
            senderId: providerId,
            serviceId: updatedBooking.serviceId.toString(),
            recipientId: customerId,
            bookingId: bookingId,
            isRead: false,
          });
          await this.notificationsGateway.customerBookingCancelled(customerId);
        }
        break;
      case 'Confirmed':
        if (customerId) {
          await this.notificationService.createNotification({
            type: 'BookingUpdate',
            message: 'Your booking has been confirmed',
            senderId: providerId,
            serviceId: updatedBooking.serviceId.toString(),
            recipientId: customerId,
            bookingId: bookingId,
            isRead: false,
          });
          await this.notificationsGateway.customerBookingConfirmed(customerId);
        }

        break;
      case 'Completed':
        if (providerId) {
          await this.notificationService.createNotification({
            type: 'BookingUpdate',
            message: 'A customer marked booking as Completed',
            senderId: customerId,
            serviceId: updatedBooking.serviceId.toString(),
            recipientId: providerId,
            bookingId: bookingId,
            isRead: false,
          });
          await this.notificationsGateway.customerBookingCompleted(providerId);
        }
        break;
    }

    if (updateBookingDto.isRated && providerId) {
      await this.notificationService.createNotification({
        type: 'ReviewSubmitted',
        message: 'A customer has submitted a review',
        senderId: customerId,
        serviceId: updatedBooking.serviceId.toString(),
        recipientId: providerId,
        bookingId: bookingId,
        isRead: false,
      });
      await this.notificationsGateway.customerReviewAdded(providerId);
    }

    return updatedBooking;
  }
}

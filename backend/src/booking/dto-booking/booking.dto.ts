export class CreateBookingDto {
  customerId: string;
  providerId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export class UpdateBookingDto {
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export class CreateBookingDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  providerDetails: string;
  serviceName: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export class UpdateBookingDto {
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

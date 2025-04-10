export class CreateBookingDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  providerDetails: string;
  serviceName: string;
  serviceId: string;
  date: Date;
  time: string;
  paymentMethod: 'Online' | 'Cash';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export class UpdateBookingDto {
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

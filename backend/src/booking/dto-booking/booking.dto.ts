export class CreateBookingDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  providerDetails: { _id: string; firstName: string; lastName: string };
  serviceName: string;
  serviceId: string;
  date: Date;
  time: string;
  paymentMethod: 'Online' | 'Cash';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Awaiting Completion';
}

export class UpdateBookingDto {
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Awaiting Completion';
  isRated?: boolean;
  rating?: number;
  comment?: string;
}

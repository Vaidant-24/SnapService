import { Service } from "./Service";

export type Booking = {
  _id: string;
  customerId: string;
  serviceId: Service;
  date: string;
  time: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  customerName: string;
  serviceName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  updatedAt: string;
  providerDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

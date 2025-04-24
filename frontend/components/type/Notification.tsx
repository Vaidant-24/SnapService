import { Booking } from "./Booking";
import { Service } from "./Service";
import { User } from "./User";

export interface Notification {
  _id: string;
  recipientId: string;
  type: "BookingUpdate" | "AwaitingApproval" | "ReviewSubmitted" | "System";
  bookingId: Booking;
  serviceId: Service;
  senderId: User;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

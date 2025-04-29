import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export enum NotificationEvent {
  BookingCompletionApproval = 'booking-completion-approval',
  BookingCancelled = 'booking-cancelled',
  BookingConfirmed = 'booking-confirmed',
  CustomerReviewAdded = 'customer-review-added',
  BookingCompleted = 'booking-completed',
  ProviderBooked = 'provider-booked',
  BookingCancelledByCustomer = 'customer-cancelled-booking',
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
      console.log(`Client ${client.id} joined room ${userId}`);
    } else {
      console.warn(`Client ${client.id} did not provide userId in query`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitToUser(userId: string, event: NotificationEvent, message: string) {
    this.server.to(userId).emit(event, {
      message,
      timestamp: new Date(),
    });
    console.log(`Emitted event ${event} to user ${userId}`);
  }

  customerBookingCompletionApproval(customerId: string) {
    this.emitToUser(customerId, NotificationEvent.BookingCompletionApproval, 'new-pending-completion');
  }

  customerBookingCancelled(customerId: string) {
    this.emitToUser(customerId, NotificationEvent.BookingCancelled, 'booking-cancelled');
  }

  BookingCancelledByCustomer(providerId: string) {
    this.emitToUser(providerId, NotificationEvent.BookingCancelledByCustomer, 'customer-cancelled-booking');
  }

  customerBookingConfirmed(customerId: string) {
    this.emitToUser(customerId, NotificationEvent.BookingConfirmed, 'booking-confirmed');
  }

  customerReviewAdded(providerId: string) {
    this.emitToUser(providerId, NotificationEvent.CustomerReviewAdded, 'new-review-added');
  }

  customerBookingCompleted(providerId: string) {
    this.emitToUser(providerId, NotificationEvent.BookingCompleted, 'booking-completed');
  }

  ProviderBookedByCustomer(providerId: string) {
    this.emitToUser(providerId, NotificationEvent.ProviderBooked, 'provider-booked');
  }
}

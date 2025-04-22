// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyCustomer(customerId: string) {
    this.server.emit(`booking-update-${customerId}`, { message: 'new-pending-completion' });
  }

  customerBookingCancelled(customerId: string) {
    this.server.emit(`booking-cancelled-${customerId}`, { message: 'booking-cancelled' });
  }

  sendNotificationToProvider(providerId: string) {
    this.server.emit(`review-${providerId}`, { message: 'new-review-added' });
  }
}

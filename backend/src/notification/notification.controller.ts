import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 🔔 Create a notification
  @Post()
  async createNotification(@Body() createDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createDto);
  }

  // 📬 Get all notifications for a user
  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.findNotificationsByUser(userId);
  }

  // 📬 Count of unread notifications
  @Get('user/:userId/unread/count')
  async countUnread(@Param('userId') userId: string) {
    return this.notificationService.countUnread(userId);
  }

  // ✅ Mark a specific notification as read
  @Patch(':id/read')
  async markNotificationRead(@Param('id') notificationId: string, @Body() updateDto: UpdateNotificationDto) {
    return this.notificationService.updateNotification(notificationId, updateDto);
  }
}

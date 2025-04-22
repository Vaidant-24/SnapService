import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(createDto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationModel.create(createDto);
  }

  async findNotificationsByUser(userId: string): Promise<Notification[]> {
    return await this.notificationModel.find({ recipientId: userId }).sort({ createdAt: -1 });
  }

  async countUnread(userId: string): Promise<number> {
    return await this.notificationModel.countDocuments({
      recipientId: userId,
      isRead: false,
    });
  }

  async updateNotification(id: string, updateDto: UpdateNotificationDto): Promise<Notification> {
    const updatedNotification = await this.notificationModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!updatedNotification) {
      throw new Error('Notification not found');
    }
    return updatedNotification;
  }
}

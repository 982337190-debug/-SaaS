import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      user_id: createNotificationDto.user_id,
      type: createNotificationDto.type as NotificationType,
      status: NotificationStatus.UNREAD,
      title: createNotificationDto.title,
      description: createNotificationDto.description,
      link: createNotificationDto.link,
    });
    await this.notificationRepository.save(notification);
    return notification;
  }

  async findByUser(userId: string, page: number = 1, pageSize: number = 20) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    return { data: notifications, total, page, pageSize };
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new BadRequestException('通知不存在');
    }
    return notification;
  }

  async markAsRead(id: string) {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    await this.notificationRepository.save(notification);
    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { user_id: userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
    return { message: '全部已标记为已读' };
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.count({ where: { user_id: userId, status: NotificationStatus.UNREAD } });
  }

  async remove(id: string) {
    const notification = await this.findOne(id);
    await this.notificationRepository.delete(id);
    return { message: '通知已删除' };
  }

  async sendTodo(userId: string, title: string, description?: string, link?: string) {
    return this.create({
      user_id: userId,
      type: NotificationType.TODO,
      title,
      description,
      link,
    });
  }

  async sendInfo(userId: string, title: string, description?: string) {
    return this.create({
      user_id: userId,
      type: NotificationType.INFO,
      title,
      description,
    });
  }
}
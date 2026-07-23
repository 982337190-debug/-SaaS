import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/notification.dto';
export declare class NotificationService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findByUser(userId: string, page?: number, pageSize?: number): Promise<{
        data: Notification[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendTodo(userId: string, title: string, description?: string, link?: string): Promise<Notification>;
    sendInfo(userId: string, title: string, description?: string): Promise<Notification>;
}

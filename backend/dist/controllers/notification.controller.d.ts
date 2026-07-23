import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<import("../entities/notification.entity").Notification>;
    findByUser(userId: string, page?: number, pageSize?: number): Promise<{
        data: import("../entities/notification.entity").Notification[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/notification.entity").Notification>;
    markAsRead(id: string): Promise<import("../entities/notification.entity").Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

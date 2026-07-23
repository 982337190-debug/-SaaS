"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationService = class NotificationService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(createNotificationDto) {
        const notification = this.notificationRepository.create({
            user_id: createNotificationDto.user_id,
            type: createNotificationDto.type,
            status: notification_entity_1.NotificationStatus.UNREAD,
            title: createNotificationDto.title,
            description: createNotificationDto.description,
            link: createNotificationDto.link,
        });
        await this.notificationRepository.save(notification);
        return notification;
    }
    async findByUser(userId, page = 1, pageSize = 20) {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return { data: notifications, total, page, pageSize };
    }
    async findOne(id) {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new common_1.BadRequestException('通知不存在');
        }
        return notification;
    }
    async markAsRead(id) {
        const notification = await this.findOne(id);
        notification.status = notification_entity_1.NotificationStatus.READ;
        await this.notificationRepository.save(notification);
        return notification;
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ user_id: userId, status: notification_entity_1.NotificationStatus.UNREAD }, { status: notification_entity_1.NotificationStatus.READ });
        return { message: '全部已标记为已读' };
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({ where: { user_id: userId, status: notification_entity_1.NotificationStatus.UNREAD } });
    }
    async remove(id) {
        const notification = await this.findOne(id);
        await this.notificationRepository.delete(id);
        return { message: '通知已删除' };
    }
    async sendTodo(userId, title, description, link) {
        return this.create({
            user_id: userId,
            type: notification_entity_1.NotificationType.TODO,
            title,
            description,
            link,
        });
    }
    async sendInfo(userId, title, description) {
        return this.create({
            user_id: userId,
            type: notification_entity_1.NotificationType.INFO,
            title,
            description,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map
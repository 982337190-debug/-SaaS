export declare enum NotificationType {
    TODO = "todo",
    INFO = "info",
    WARNING = "warning"
}
export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read"
}
export declare class Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    status: NotificationStatus;
    title: string;
    description: string;
    link: string;
    data: string;
    created_at: Date;
}

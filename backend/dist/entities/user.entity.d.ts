import { Role } from './role.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class User {
    id: string;
    phone: string;
    password: string;
    name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    region: string;
    position: string;
    roles: Role[];
    created_at: Date;
    updated_at: Date;
}

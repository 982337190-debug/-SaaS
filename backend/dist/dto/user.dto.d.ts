export declare class CreateUserDto {
    phone: string;
    password: string;
    name: string;
    email?: string;
    region?: string;
    position?: string;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    region?: string;
    position?: string;
    avatar?: string;
}
export declare class AssignRoleDto {
    role_ids: string[];
}

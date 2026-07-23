import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from '../dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    findAll(page?: number, pageSize?: number, search?: string): Promise<{
        data: import("../entities/user.entity").User[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../entities/user.entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignRoles(id: string, assignRoleDto: AssignRoleDto): Promise<import("../entities/user.entity").User>;
    findByRegion(region: string): Promise<import("../entities/user.entity").User[]>;
}

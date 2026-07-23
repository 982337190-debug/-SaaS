import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from '../dto/user.dto';
export declare class UserService {
    private userRepository;
    private roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, pageSize?: number, search?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignRoles(id: string, assignRoleDto: AssignRoleDto): Promise<User>;
    findByRegion(region: string): Promise<User[]>;
}

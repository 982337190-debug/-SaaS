import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto): Promise<import("../entities/role.entity").Role>;
    findAll(): Promise<import("../entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("../entities/role.entity").Role>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("../entities/role.entity").Role>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(createPermissionDto: CreatePermissionDto): Promise<import("../entities/permission.entity").Permission>;
    findAll(): Promise<import("../entities/permission.entity").Permission[]>;
    findOne(id: string): Promise<import("../entities/permission.entity").Permission>;
    update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<import("../entities/permission.entity").Permission>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByModule(module: string): Promise<import("../entities/permission.entity").Permission[]>;
    getAllModules(): Promise<any>;
}

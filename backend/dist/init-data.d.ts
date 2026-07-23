import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
export declare class InitService {
    private userRepo;
    private roleRepo;
    private permRepo;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>, permRepo: Repository<Permission>);
    init(): Promise<void>;
}

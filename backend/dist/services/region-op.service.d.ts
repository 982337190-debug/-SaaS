import { Repository } from 'typeorm';
import { RegionOp } from '../entities/region-op.entity';
import { User } from '../entities/user.entity';
import { CreateRegionOpDto, UpdateRegionOpDto } from '../dto/region-op.dto';
export declare class RegionOpService {
    private regionOpRepository;
    private userRepository;
    constructor(regionOpRepository: Repository<RegionOp>, userRepository: Repository<User>);
    create(createRegionOpDto: CreateRegionOpDto): Promise<RegionOp>;
    findAll(): Promise<RegionOp[]>;
    findOne(id: string): Promise<RegionOp>;
    update(id: string, updateRegionOpDto: UpdateRegionOpDto): Promise<RegionOp>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findOpByRegion(region: string): Promise<User | undefined>;
    getAllRegions(): Promise<any>;
}

import { RegionOpService } from '../services/region-op.service';
import { CreateRegionOpDto, UpdateRegionOpDto } from '../dto/region-op.dto';
export declare class RegionOpController {
    private readonly regionOpService;
    constructor(regionOpService: RegionOpService);
    create(createRegionOpDto: CreateRegionOpDto): Promise<import("../entities/region-op.entity").RegionOp>;
    findAll(): Promise<import("../entities/region-op.entity").RegionOp[]>;
    findOne(id: string): Promise<import("../entities/region-op.entity").RegionOp>;
    update(id: string, updateRegionOpDto: UpdateRegionOpDto): Promise<import("../entities/region-op.entity").RegionOp>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findOpByRegion(region: string): Promise<import("../entities/user.entity").User | undefined>;
    getAllRegions(): Promise<any>;
}

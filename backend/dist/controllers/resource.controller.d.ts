import { ResourceService } from '../services/resource.service';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource.dto';
export declare class ResourceController {
    private readonly resourceService;
    constructor(resourceService: ResourceService);
    create(createResourceDto: CreateResourceDto): Promise<import("../entities/resource.entity").Resource>;
    findAll(page?: number, pageSize?: number, search?: string, type?: string, city?: string): Promise<{
        data: import("../entities/resource.entity").Resource[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/resource.entity").Resource>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<import("../entities/resource.entity").Resource>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByType(type: string): Promise<import("../entities/resource.entity").Resource[]>;
    findByCity(city: string): Promise<import("../entities/resource.entity").Resource[]>;
    getTypes(): Promise<import("../entities/quote-day-resource.entity").ResourceType[]>;
}

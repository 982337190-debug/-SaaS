import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { ResourceType } from '../entities/quote-day-resource.entity';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource.dto';
export declare class ResourceService {
    private resourceRepository;
    constructor(resourceRepository: Repository<Resource>);
    create(createResourceDto: CreateResourceDto): Promise<Resource>;
    findAll(page?: number, pageSize?: number, search?: string, type?: string, city?: string): Promise<{
        data: Resource[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Resource>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<Resource>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByType(type: string): Promise<Resource[]>;
    findByCity(city: string): Promise<Resource[]>;
    getTypes(): Promise<ResourceType[]>;
}

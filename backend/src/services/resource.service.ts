import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { ResourceType } from '../entities/quote-day-resource.entity';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto) {
    const { type, name, grade, city, supplier, price, price_unit, description, contact, enabled } = createResourceDto;
    
    const resource = this.resourceRepository.create({
      type: type as ResourceType,
      name,
      grade,
      city,
      supplier,
      price,
      price_unit,
      description,
      contact,
      enabled: enabled !== undefined ? enabled : true,
    });
    
    await this.resourceRepository.save(resource);
    return resource;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string, type?: string, city?: string) {
    const query = this.resourceRepository.createQueryBuilder('resource')
      .where('resource.enabled = true');
    
    if (search) {
      query.andWhere('resource.name LIKE :search', { search: `%${search}%` });
    }
    
    if (type) {
      query.andWhere('resource.type = :type', { type });
    }
    
    if (city) {
      query.andWhere('resource.city LIKE :city', { city: `%${city}%` });
    }
    
    const [resources, total] = await query
      .orderBy('resource.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: resources, total, page, pageSize };
  }

  async findOne(id: string) {
    const resource = await this.resourceRepository.findOne({ where: { id, enabled: true } });
    if (!resource) {
      throw new BadRequestException('资源不存在');
    }
    return resource;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    const resource = await this.findOne(id);
    Object.assign(resource, updateResourceDto);
    await this.resourceRepository.save(resource);
    return resource;
  }

  async remove(id: string) {
    const resource = await this.findOne(id);
    resource.enabled = false;
    await this.resourceRepository.save(resource);
    return { message: '资源已禁用' };
  }

  async findByType(type: string) {
    return this.resourceRepository.find({ where: { type: type as ResourceType, enabled: true } });
  }

  async findByCity(city: string) {
    return this.resourceRepository.find({ where: { city, enabled: true } });
  }

  async getTypes() {
    return Object.values(ResourceType);
  }
}
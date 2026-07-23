"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_entity_1 = require("../entities/resource.entity");
const quote_day_resource_entity_1 = require("../entities/quote-day-resource.entity");
let ResourceService = class ResourceService {
    resourceRepository;
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
    async create(createResourceDto) {
        const { type, name, grade, city, supplier, price, price_unit, description, contact, enabled } = createResourceDto;
        const resource = this.resourceRepository.create({
            type: type,
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
    async findAll(page = 1, pageSize = 10, search, type, city) {
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
    async findOne(id) {
        const resource = await this.resourceRepository.findOne({ where: { id, enabled: true } });
        if (!resource) {
            throw new common_1.BadRequestException('资源不存在');
        }
        return resource;
    }
    async update(id, updateResourceDto) {
        const resource = await this.findOne(id);
        Object.assign(resource, updateResourceDto);
        await this.resourceRepository.save(resource);
        return resource;
    }
    async remove(id) {
        const resource = await this.findOne(id);
        resource.enabled = false;
        await this.resourceRepository.save(resource);
        return { message: '资源已禁用' };
    }
    async findByType(type) {
        return this.resourceRepository.find({ where: { type: type, enabled: true } });
    }
    async findByCity(city) {
        return this.resourceRepository.find({ where: { city, enabled: true } });
    }
    async getTypes() {
        return Object.values(quote_day_resource_entity_1.ResourceType);
    }
};
exports.ResourceService = ResourceService;
exports.ResourceService = ResourceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResourceService);
//# sourceMappingURL=resource.service.js.map
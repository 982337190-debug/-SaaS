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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const procurement_entity_1 = require("../entities/procurement.entity");
const procurement_inquiry_entity_1 = require("../entities/procurement-inquiry.entity");
const team_entity_1 = require("../entities/team.entity");
const resource_entity_1 = require("../entities/resource.entity");
let ProcurementService = class ProcurementService {
    procurementRepository;
    procurementInquiryRepository;
    teamRepository;
    resourceRepository;
    constructor(procurementRepository, procurementInquiryRepository, teamRepository, resourceRepository) {
        this.procurementRepository = procurementRepository;
        this.procurementInquiryRepository = procurementInquiryRepository;
        this.teamRepository = teamRepository;
        this.resourceRepository = resourceRepository;
    }
    async create(createProcurementDto, userId) {
        const { type, name, city, start_date, end_date, resource_id, supplier, team_id, quantity, remarks } = createProcurementDto;
        const team = await this.teamRepository.findOne({ where: { id: team_id } });
        if (!team) {
            throw new common_1.BadRequestException('团队不存在');
        }
        let resource = null;
        if (resource_id) {
            resource = await this.resourceRepository.findOne({ where: { id: resource_id } });
            if (!resource)
                throw new common_1.BadRequestException('资源不存在');
        }
        const procurement = this.procurementRepository.create({
            type: type,
            name,
            city,
            start_date,
            end_date,
            resource_id,
            supplier: supplier || resource?.supplier,
            team_id,
            quantity,
            remarks,
            status: procurement_entity_1.ProcurementStatus.PENDING,
        });
        await this.procurementRepository.save(procurement);
        if (procurement.status === procurement_entity_1.ProcurementStatus.PENDING) {
            const inquiry = this.procurementInquiryRepository.create({
                procurement_id: procurement.id,
                operator_id: userId,
                source: 'OP录入',
                content: `${name} 询价发起`,
                status: procurement_inquiry_entity_1.InquiryStatus.INITIATED,
            });
            await this.procurementInquiryRepository.save(inquiry);
        }
        return procurement;
    }
    async findAll(page = 1, pageSize = 10, search, type, status) {
        const query = this.procurementRepository.createQueryBuilder('procurement')
            .leftJoinAndSelect('procurement.team', 'team')
            .leftJoinAndSelect('procurement.resource', 'resource');
        if (search) {
            query.where('procurement.name LIKE :search OR procurement.supplier LIKE :search OR procurement.city LIKE :search', { search: `%${search}%` });
        }
        if (type) {
            query.andWhere('procurement.type = :type', { type });
        }
        if (status) {
            query.andWhere('procurement.status = :status', { status });
        }
        const [procurements, total] = await query
            .orderBy('procurement.created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data: procurements, total, page, pageSize };
    }
    async findOne(id) {
        const procurement = await this.procurementRepository.findOne({
            where: { id },
            relations: { team: true, resource: true, inquiries: true },
        });
        if (!procurement) {
            throw new common_1.BadRequestException('采购记录不存在');
        }
        return procurement;
    }
    async update(id, updateProcurementDto) {
        const procurement = await this.findOne(id);
        Object.assign(procurement, updateProcurementDto);
        await this.procurementRepository.save(procurement);
        return procurement;
    }
    async addInquiry(id, createInquiryDto, userId) {
        const procurement = await this.findOne(id);
        const inquiry = this.procurementInquiryRepository.create({
            procurement_id: id,
            operator_id: userId,
            source: createInquiryDto.source,
            content: createInquiryDto.content,
            quoted_price: createInquiryDto.quoted_price,
            status: createInquiryDto.quoted_price ? procurement_inquiry_entity_1.InquiryStatus.QUOTED : procurement_inquiry_entity_1.InquiryStatus.INITIATED,
        });
        await this.procurementInquiryRepository.save(inquiry);
        if (createInquiryDto.quoted_price && procurement.status === procurement_entity_1.ProcurementStatus.INQUIRING) {
            procurement.status = procurement_entity_1.ProcurementStatus.QUOTED;
            procurement.confirmed_price = createInquiryDto.quoted_price;
            await this.procurementRepository.save(procurement);
        }
        return inquiry;
    }
    async confirmInquiry(id, inquiryId, userId) {
        const procurement = await this.findOne(id);
        const inquiry = await this.procurementInquiryRepository.findOne({ where: { id: inquiryId } });
        if (!inquiry) {
            throw new common_1.BadRequestException('询价记录不存在');
        }
        inquiry.status = procurement_inquiry_entity_1.InquiryStatus.CONFIRMED;
        await this.procurementInquiryRepository.save(inquiry);
        procurement.status = procurement_entity_1.ProcurementStatus.BOOKED;
        procurement.confirmed_price = inquiry.quoted_price;
        await this.procurementRepository.save(procurement);
        return procurement;
    }
    async updateStatus(id, status) {
        const procurement = await this.findOne(id);
        procurement.status = status;
        await this.procurementRepository.save(procurement);
        return procurement;
    }
    async getDashboardStats() {
        const total = await this.procurementRepository.count();
        const pending = await this.procurementRepository.count({ where: { status: procurement_entity_1.ProcurementStatus.PENDING } });
        const inquiring = await this.procurementRepository.count({ where: { status: procurement_entity_1.ProcurementStatus.INQUIRING } });
        const booked = await this.procurementRepository.count({ where: { status: procurement_entity_1.ProcurementStatus.BOOKED } });
        return { total, pending, inquiring, booked };
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(procurement_entity_1.Procurement)),
    __param(1, (0, typeorm_1.InjectRepository)(procurement_inquiry_entity_1.ProcurementInquiry)),
    __param(2, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(3, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProcurementService);
//# sourceMappingURL=procurement.service.js.map
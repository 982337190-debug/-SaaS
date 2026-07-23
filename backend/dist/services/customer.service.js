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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../entities/customer.entity");
let CustomerService = class CustomerService {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async create(createCustomerDto) {
        const customer = this.customerRepository.create(createCustomerDto);
        await this.customerRepository.save(customer);
        return customer;
    }
    async findAll(page = 1, pageSize = 10, search) {
        const query = this.customerRepository.createQueryBuilder('customer')
            .where('customer.enabled = true');
        if (search) {
            query.andWhere('customer.name LIKE :search OR customer.contact LIKE :search', { search: `%${search}%` });
        }
        const [customers, total] = await query
            .orderBy('customer.created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data: customers, total, page, pageSize };
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({ where: { id, enabled: true } });
        if (!customer) {
            throw new common_1.BadRequestException('客户不存在');
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        const customer = await this.findOne(id);
        Object.assign(customer, updateCustomerDto);
        await this.customerRepository.save(customer);
        return customer;
    }
    async remove(id) {
        const customer = await this.findOne(id);
        customer.enabled = false;
        await this.customerRepository.save(customer);
        return { message: '客户已禁用' };
    }
    async findAllSimple() {
        return this.customerRepository.find({
            where: { enabled: true },
            select: { id: true, name: true }
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerService);
//# sourceMappingURL=customer.service.js.map
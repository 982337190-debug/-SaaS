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
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quote_entity_1 = require("../entities/quote.entity");
const quote_day_entity_1 = require("../entities/quote-day.entity");
const quote_day_resource_entity_1 = require("../entities/quote-day-resource.entity");
const customer_entity_1 = require("../entities/customer.entity");
const team_entity_1 = require("../entities/team.entity");
const team_entity_2 = require("../entities/team.entity");
let QuoteService = class QuoteService {
    quoteRepository;
    quoteDayRepository;
    quoteDayResourceRepository;
    customerRepository;
    teamRepository;
    constructor(quoteRepository, quoteDayRepository, quoteDayResourceRepository, customerRepository, teamRepository) {
        this.quoteRepository = quoteRepository;
        this.quoteDayRepository = quoteDayRepository;
        this.quoteDayResourceRepository = quoteDayResourceRepository;
        this.customerRepository = customerRepository;
        this.teamRepository = teamRepository;
    }
    generateQuoteNo() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `Q${year}${month}${day}${random}`;
    }
    async create(createQuoteDto, userId) {
        const { name, customer_id, type, people, departure_date, days, remarks, days_data } = createQuoteDto;
        const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
        if (!customer) {
            throw new common_1.BadRequestException('客户不存在');
        }
        const quoteNo = this.generateQuoteNo();
        const quote = this.quoteRepository.create({
            quote_no: quoteNo,
            name,
            customer_id,
            type: type,
            people,
            departure_date: new Date(departure_date),
            days,
            remarks,
            created_by_id: userId,
        });
        await this.quoteRepository.save(quote);
        if (days_data && days_data.length > 0) {
            for (const dayDto of days_data) {
                const day = this.quoteDayRepository.create({
                    quote_id: quote.id,
                    day_num: dayDto.day_num,
                    date: dayDto.date,
                    city: dayDto.city,
                });
                await this.quoteDayRepository.save(day);
                for (const resourceDto of dayDto.resources) {
                    const resource = this.quoteDayResourceRepository.create({
                        day_id: day.id,
                        resource_id: resourceDto.resource_id,
                        type: resourceDto.type,
                        name: resourceDto.name,
                        grade: resourceDto.grade,
                        detail: resourceDto.detail,
                        price: resourceDto.price,
                        supplier: resourceDto.supplier,
                    });
                    await this.quoteDayResourceRepository.save(resource);
                }
            }
        }
        return quote;
    }
    async findAll(page = 1, pageSize = 10, search, status) {
        const query = this.quoteRepository.createQueryBuilder('quote')
            .leftJoinAndSelect('quote.customer', 'customer');
        if (search) {
            query.where('quote.quote_no LIKE :search OR quote.name LIKE :search OR customer.name LIKE :search', { search: `%${search}%` });
        }
        if (status) {
            query.andWhere('quote.status = :status', { status });
        }
        const [quotes, total] = await query
            .orderBy('quote.created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data: quotes, total, page, pageSize };
    }
    async findOne(id) {
        const quote = await this.quoteRepository.findOne({
            where: { id },
            relations: { customer: true, days_data: { resources: true } },
        });
        if (!quote) {
            throw new common_1.BadRequestException('报价不存在');
        }
        return quote;
    }
    async update(id, updateQuoteDto) {
        const quote = await this.findOne(id);
        if (quote.status === quote_entity_1.QuoteStatus.CONFIRMED || quote.status === quote_entity_1.QuoteStatus.EXPIRED) {
            throw new common_1.BadRequestException('已确认或失效的报价无法修改');
        }
        const { name, customer_id, type, people, departure_date, days, remarks, days_data } = updateQuoteDto;
        if (name)
            quote.name = name;
        if (customer_id) {
            const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
            if (!customer)
                throw new common_1.BadRequestException('客户不存在');
            quote.customer_id = customer_id;
        }
        if (type)
            quote.type = type;
        if (people)
            quote.people = people;
        if (departure_date)
            quote.departure_date = new Date(departure_date);
        if (days)
            quote.days = days;
        if (remarks)
            quote.remarks = remarks;
        await this.quoteRepository.save(quote);
        if (days_data) {
            await this.quoteDayResourceRepository.delete({ day_id: id });
            await this.quoteDayRepository.delete({ quote_id: id });
            for (const dayDto of days_data) {
                const day = this.quoteDayRepository.create({
                    quote_id: quote.id,
                    day_num: dayDto.day_num,
                    date: dayDto.date,
                    city: dayDto.city,
                });
                await this.quoteDayRepository.save(day);
                for (const resourceDto of dayDto.resources) {
                    const resource = this.quoteDayResourceRepository.create({
                        day_id: day.id,
                        resource_id: resourceDto.resource_id,
                        type: resourceDto.type,
                        name: resourceDto.name,
                        grade: resourceDto.grade,
                        detail: resourceDto.detail,
                        price: resourceDto.price,
                        supplier: resourceDto.supplier,
                    });
                    await this.quoteDayResourceRepository.save(resource);
                }
            }
        }
        return quote;
    }
    async submitForApproval(id) {
        const quote = await this.findOne(id);
        if (quote.status !== quote_entity_1.QuoteStatus.DRAFT) {
            throw new common_1.BadRequestException('只有草稿状态的报价才能提交审批');
        }
        quote.status = quote_entity_1.QuoteStatus.PENDING;
        await this.quoteRepository.save(quote);
        return quote;
    }
    async approve(id) {
        const quote = await this.findOne(id);
        if (quote.status !== quote_entity_1.QuoteStatus.PENDING) {
            throw new common_1.BadRequestException('只有待审批状态的报价才能审批');
        }
        quote.status = quote_entity_1.QuoteStatus.SENT;
        await this.quoteRepository.save(quote);
        return quote;
    }
    async sendToCustomer(id) {
        const quote = await this.findOne(id);
        if (quote.status !== quote_entity_1.QuoteStatus.SENT) {
            throw new common_1.BadRequestException('报价状态不正确');
        }
        quote.status = quote_entity_1.QuoteStatus.SENT;
        await this.quoteRepository.save(quote);
        return quote;
    }
    async confirm(id) {
        const quote = await this.findOne(id);
        if (quote.status !== quote_entity_1.QuoteStatus.SENT) {
            throw new common_1.BadRequestException('只有已发送客户的报价才能确认');
        }
        quote.status = quote_entity_1.QuoteStatus.CONFIRMED;
        await this.quoteRepository.save(quote);
        const teamNo = this.generateTeamNo();
        const team = this.teamRepository.create({
            team_no: teamNo,
            customer_id: quote.customer_id,
            quote_id: quote.id,
            quote_name: quote.name,
            people: quote.people,
            departure_date: quote.departure_date,
            status: team_entity_2.TeamStatus.FORMED,
        });
        await this.teamRepository.save(team);
        return { quote, team };
    }
    generateTeamNo() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TM${year}${month}${day}${random}`;
    }
    async expire(id) {
        const quote = await this.findOne(id);
        quote.status = quote_entity_1.QuoteStatus.EXPIRED;
        await this.quoteRepository.save(quote);
        return quote;
    }
    async delete(id) {
        const quote = await this.findOne(id);
        if (quote.status !== quote_entity_1.QuoteStatus.DRAFT) {
            throw new common_1.BadRequestException('只有草稿状态的报价才能删除');
        }
        await this.quoteDayResourceRepository.delete({ day_id: id });
        await this.quoteDayRepository.delete({ quote_id: id });
        await this.quoteRepository.delete(id);
        return { message: '报价已删除' };
    }
    async getDashboardStats() {
        const total = await this.quoteRepository.count();
        const draft = await this.quoteRepository.count({ where: { status: quote_entity_1.QuoteStatus.DRAFT } });
        const pending = await this.quoteRepository.count({ where: { status: quote_entity_1.QuoteStatus.PENDING } });
        const confirmed = await this.quoteRepository.count({ where: { status: quote_entity_1.QuoteStatus.CONFIRMED } });
        return { total, draft, pending, confirmed };
    }
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quote_entity_1.Quote)),
    __param(1, (0, typeorm_1.InjectRepository)(quote_day_entity_1.QuoteDay)),
    __param(2, (0, typeorm_1.InjectRepository)(quote_day_resource_entity_1.QuoteDayResource)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuoteService);
//# sourceMappingURL=quote.service.js.map
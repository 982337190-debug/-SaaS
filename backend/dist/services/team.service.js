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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("../entities/team.entity");
const team_log_entity_1 = require("../entities/team-log.entity");
const customer_entity_1 = require("../entities/customer.entity");
const quote_entity_1 = require("../entities/quote.entity");
const region_op_entity_1 = require("../entities/region-op.entity");
const user_entity_1 = require("../entities/user.entity");
let TeamService = class TeamService {
    teamRepository;
    teamLogRepository;
    customerRepository;
    quoteRepository;
    regionOpRepository;
    userRepository;
    constructor(teamRepository, teamLogRepository, customerRepository, quoteRepository, regionOpRepository, userRepository) {
        this.teamRepository = teamRepository;
        this.teamLogRepository = teamLogRepository;
        this.customerRepository = customerRepository;
        this.quoteRepository = quoteRepository;
        this.regionOpRepository = regionOpRepository;
        this.userRepository = userRepository;
    }
    generateTeamNo() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TM${year}${month}${day}${random}`;
    }
    async create(createTeamDto, userId) {
        const { customer_id, quote_id, quote_name, people, op_id, departure_date, return_date, remarks } = createTeamDto;
        const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
        if (!customer) {
            throw new common_1.BadRequestException('客户不存在');
        }
        let region = '';
        if (quote_id) {
            const quote = await this.quoteRepository.findOne({ where: { id: quote_id } });
            if (!quote)
                throw new common_1.BadRequestException('报价不存在');
            region = this.extractRegionFromQuote(quote);
        }
        let assignedOpId = op_id;
        if (!assignedOpId && region) {
            const regionOp = await this.regionOpRepository.findOne({ where: { region } });
            if (regionOp) {
                assignedOpId = regionOp.op_id;
            }
        }
        const teamNo = this.generateTeamNo();
        const team = this.teamRepository.create({
            team_no: teamNo,
            customer_id,
            quote_id,
            quote_name,
            people,
            op_id: assignedOpId,
            departure_date,
            return_date,
            remarks,
            status: team_entity_1.TeamStatus.FORMED,
        });
        await this.teamRepository.save(team);
        await this.createLog(team.id, userId, '团队创建', quote_name ? `报价确认后自动生成团队: ${quote_name}` : '手动创建团队');
        if (assignedOpId) {
            await this.createLog(team.id, userId, 'OP分配', `系统按区域规则匹配主OP`);
        }
        return team;
    }
    extractRegionFromQuote(quote) {
        const regionMap = {
            '日本': '日本区',
            '东京': '日本区',
            '大阪': '日本区',
            '京都': '日本区',
            '泰国': '东南亚区',
            '清迈': '东南亚区',
            '巴厘岛': '东南亚区',
            '越南': '东南亚区',
            '新加坡': '东南亚区',
            '韩国': '韩国区',
            '首尔': '韩国区',
            '济州': '韩国区',
            '欧洲': '欧洲区',
            '澳洲': '大洋洲区',
            '迪拜': '中东区',
        };
        for (const key of Object.keys(regionMap)) {
            if (quote.name.includes(key)) {
                return regionMap[key];
            }
        }
        return '';
    }
    async findAll(page = 1, pageSize = 10, search, status) {
        const query = this.teamRepository.createQueryBuilder('team')
            .leftJoinAndSelect('team.customer', 'customer')
            .leftJoinAndSelect('team.op', 'op');
        if (search) {
            query.where('team.team_no LIKE :search OR customer.name LIKE :search OR team.quote_name LIKE :search', { search: `%${search}%` });
        }
        if (status) {
            query.andWhere('team.status = :status', { status });
        }
        const [teams, total] = await query
            .orderBy('team.departure_date', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data: teams, total, page, pageSize };
    }
    async findOne(id) {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: { customer: true, op: true, logs: true },
        });
        if (!team) {
            throw new common_1.BadRequestException('团队不存在');
        }
        return team;
    }
    async update(id, updateTeamDto) {
        const team = await this.findOne(id);
        Object.assign(team, updateTeamDto);
        await this.teamRepository.save(team);
        return team;
    }
    async updateStatus(id, updateTeamStatusDto, userId) {
        const team = await this.findOne(id);
        const { status, remark } = updateTeamStatusDto;
        team.status = status;
        await this.teamRepository.save(team);
        await this.createLog(id, userId, '状态变更', remark || `团队状态变更为: ${status}`);
        return team;
    }
    async createLog(teamId, operatorId, title, description) {
        const log = this.teamLogRepository.create({
            team_id: teamId,
            operator_id: operatorId,
            title,
            description,
        });
        await this.teamLogRepository.save(log);
    }
    async getDashboardStats() {
        const total = await this.teamRepository.count();
        const active = await this.teamRepository.count({ where: { status: team_entity_1.TeamStatus.EXECUTING } });
        const procuring = await this.teamRepository.count({ where: { status: team_entity_1.TeamStatus.PROCURING } });
        return { total, active, procuring };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(team_log_entity_1.TeamLog)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(quote_entity_1.Quote)),
    __param(4, (0, typeorm_1.InjectRepository)(region_op_entity_1.RegionOp)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeamService);
//# sourceMappingURL=team.service.js.map
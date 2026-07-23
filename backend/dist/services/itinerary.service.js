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
exports.ItineraryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const itinerary_entity_1 = require("../entities/itinerary.entity");
const team_entity_1 = require("../entities/team.entity");
let ItineraryService = class ItineraryService {
    itineraryRepository;
    teamRepository;
    constructor(itineraryRepository, teamRepository) {
        this.itineraryRepository = itineraryRepository;
        this.teamRepository = teamRepository;
    }
    async create(createItineraryDto) {
        const { team_id, name, start_date, end_date, days, remarks } = createItineraryDto;
        const team = await this.teamRepository.findOne({ where: { id: team_id } });
        if (!team) {
            throw new common_1.BadRequestException('团队不存在');
        }
        const itinerary = this.itineraryRepository.create({
            team_id,
            name,
            start_date,
            end_date,
            days,
            remarks,
            status: itinerary_entity_1.ItineraryStatus.DRAFT,
        });
        await this.itineraryRepository.save(itinerary);
        return itinerary;
    }
    async findAll(page = 1, pageSize = 10, search, status) {
        const query = this.itineraryRepository.createQueryBuilder('itinerary')
            .leftJoinAndSelect('itinerary.team', 'team');
        if (search) {
            query.where('itinerary.name LIKE :search OR team.team_no LIKE :search', { search: `%${search}%` });
        }
        if (status) {
            query.andWhere('itinerary.status = :status', { status });
        }
        const [itineraries, total] = await query
            .orderBy('itinerary.start_date', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return { data: itineraries, total, page, pageSize };
    }
    async findOne(id) {
        const itinerary = await this.itineraryRepository.findOne({
            where: { id },
            relations: { team: true },
        });
        if (!itinerary) {
            throw new common_1.BadRequestException('行程不存在');
        }
        return itinerary;
    }
    async update(id, updateItineraryDto) {
        const itinerary = await this.findOne(id);
        Object.assign(itinerary, updateItineraryDto);
        await this.itineraryRepository.save(itinerary);
        return itinerary;
    }
    async updateStatus(id, updateItineraryStatusDto) {
        const itinerary = await this.findOne(id);
        itinerary.status = updateItineraryStatusDto.status;
        await this.itineraryRepository.save(itinerary);
        return itinerary;
    }
    async updateDaysData(id, daysData) {
        const itinerary = await this.findOne(id);
        itinerary.days_data = daysData;
        await this.itineraryRepository.save(itinerary);
        return itinerary;
    }
    async getDashboardStats() {
        const total = await this.itineraryRepository.count();
        const executing = await this.itineraryRepository.count({ where: { status: itinerary_entity_1.ItineraryStatus.EXECUTING } });
        return { total, executing };
    }
};
exports.ItineraryService = ItineraryService;
exports.ItineraryService = ItineraryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(itinerary_entity_1.Itinerary)),
    __param(1, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ItineraryService);
//# sourceMappingURL=itinerary.service.js.map
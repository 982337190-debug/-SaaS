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
exports.RegionOpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const region_op_entity_1 = require("../entities/region-op.entity");
const user_entity_1 = require("../entities/user.entity");
let RegionOpService = class RegionOpService {
    regionOpRepository;
    userRepository;
    constructor(regionOpRepository, userRepository) {
        this.regionOpRepository = regionOpRepository;
        this.userRepository = userRepository;
    }
    async create(createRegionOpDto) {
        const { region, op_id, remark } = createRegionOpDto;
        const user = await this.userRepository.findOne({ where: { id: op_id } });
        if (!user) {
            throw new common_1.BadRequestException('OP用户不存在');
        }
        const existing = await this.regionOpRepository.findOne({ where: { region } });
        if (existing) {
            throw new common_1.BadRequestException('该区域已配置OP');
        }
        const regionOp = this.regionOpRepository.create({ region, op_id, remark });
        await this.regionOpRepository.save(regionOp);
        return regionOp;
    }
    async findAll() {
        return this.regionOpRepository.find({ relations: { op: true } });
    }
    async findOne(id) {
        const regionOp = await this.regionOpRepository.findOne({ where: { id }, relations: { op: true } });
        if (!regionOp) {
            throw new common_1.BadRequestException('区域OP配置不存在');
        }
        return regionOp;
    }
    async update(id, updateRegionOpDto) {
        const regionOp = await this.findOne(id);
        if (updateRegionOpDto.op_id) {
            const user = await this.userRepository.findOne({ where: { id: updateRegionOpDto.op_id } });
            if (!user)
                throw new common_1.BadRequestException('OP用户不存在');
        }
        Object.assign(regionOp, updateRegionOpDto);
        await this.regionOpRepository.save(regionOp);
        return regionOp;
    }
    async remove(id) {
        const regionOp = await this.findOne(id);
        await this.regionOpRepository.delete(id);
        return { message: '区域OP配置已删除' };
    }
    async findOpByRegion(region) {
        const regionOp = await this.regionOpRepository.findOne({ where: { region }, relations: { op: true } });
        return regionOp?.op;
    }
    async getAllRegions() {
        const result = await this.regionOpRepository.query('SELECT DISTINCT region FROM region_ops');
        return result.map(r => r.region);
    }
};
exports.RegionOpService = RegionOpService;
exports.RegionOpService = RegionOpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(region_op_entity_1.RegionOp)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RegionOpService);
//# sourceMappingURL=region-op.service.js.map
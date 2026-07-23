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
exports.RegionOpController = void 0;
const common_1 = require("@nestjs/common");
const region_op_service_1 = require("../services/region-op.service");
const region_op_dto_1 = require("../dto/region-op.dto");
let RegionOpController = class RegionOpController {
    regionOpService;
    constructor(regionOpService) {
        this.regionOpService = regionOpService;
    }
    async create(createRegionOpDto) {
        return this.regionOpService.create(createRegionOpDto);
    }
    async findAll() {
        return this.regionOpService.findAll();
    }
    async findOne(id) {
        return this.regionOpService.findOne(id);
    }
    async update(id, updateRegionOpDto) {
        return this.regionOpService.update(id, updateRegionOpDto);
    }
    async remove(id) {
        return this.regionOpService.remove(id);
    }
    async findOpByRegion(region) {
        return this.regionOpService.findOpByRegion(region);
    }
    async getAllRegions() {
        return this.regionOpService.getAllRegions();
    }
};
exports.RegionOpController = RegionOpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [region_op_dto_1.CreateRegionOpDto]),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, region_op_dto_1.UpdateRegionOpDto]),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('region/:region'),
    __param(0, (0, common_1.Param)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "findOpByRegion", null);
__decorate([
    (0, common_1.Get)('regions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegionOpController.prototype, "getAllRegions", null);
exports.RegionOpController = RegionOpController = __decorate([
    (0, common_1.Controller)('region-ops'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [region_op_service_1.RegionOpService])
], RegionOpController);
//# sourceMappingURL=region-op.controller.js.map
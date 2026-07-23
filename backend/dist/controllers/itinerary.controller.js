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
exports.ItineraryController = void 0;
const common_1 = require("@nestjs/common");
const itinerary_service_1 = require("../services/itinerary.service");
const itinerary_dto_1 = require("../dto/itinerary.dto");
let ItineraryController = class ItineraryController {
    itineraryService;
    constructor(itineraryService) {
        this.itineraryService = itineraryService;
    }
    async create(createItineraryDto) {
        return this.itineraryService.create(createItineraryDto);
    }
    async findAll(page = 1, pageSize = 10, search, status) {
        return this.itineraryService.findAll(page, pageSize, search, status);
    }
    async findOne(id) {
        return this.itineraryService.findOne(id);
    }
    async update(id, updateItineraryDto) {
        return this.itineraryService.update(id, updateItineraryDto);
    }
    async updateStatus(id, updateItineraryStatusDto) {
        return this.itineraryService.updateStatus(id, updateItineraryStatusDto);
    }
    async updateDaysData(id, body) {
        return this.itineraryService.updateDaysData(id, body.days_data);
    }
    async getDashboardStats() {
        return this.itineraryService.getDashboardStats();
    }
};
exports.ItineraryController = ItineraryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [itinerary_dto_1.CreateItineraryDto]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, itinerary_dto_1.UpdateItineraryDto]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, itinerary_dto_1.UpdateItineraryStatusDto]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/days-data'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "updateDaysData", null);
__decorate([
    (0, common_1.Get)('stats/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "getDashboardStats", null);
exports.ItineraryController = ItineraryController = __decorate([
    (0, common_1.Controller)('itineraries'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [itinerary_service_1.ItineraryService])
], ItineraryController);
//# sourceMappingURL=itinerary.controller.js.map
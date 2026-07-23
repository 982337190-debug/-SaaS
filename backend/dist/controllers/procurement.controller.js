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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const procurement_service_1 = require("../services/procurement.service");
const procurement_dto_1 = require("../dto/procurement.dto");
let ProcurementController = class ProcurementController {
    procurementService;
    constructor(procurementService) {
        this.procurementService = procurementService;
    }
    async create(createProcurementDto) {
        return this.procurementService.create(createProcurementDto, 'test-user-id');
    }
    async findAll(page = 1, pageSize = 10, search, type, status) {
        return this.procurementService.findAll(page, pageSize, search, type, status);
    }
    async findOne(id) {
        return this.procurementService.findOne(id);
    }
    async update(id, updateProcurementDto) {
        return this.procurementService.update(id, updateProcurementDto);
    }
    async addInquiry(id, createInquiryDto) {
        return this.procurementService.addInquiry(id, createInquiryDto, 'test-user-id');
    }
    async confirmInquiry(id, inquiryId) {
        return this.procurementService.confirmInquiry(id, inquiryId, 'test-user-id');
    }
    async updateStatus(id, body) {
        return this.procurementService.updateStatus(id, body.status);
    }
    async getDashboardStats() {
        return this.procurementService.getDashboardStats();
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [procurement_dto_1.CreateProcurementDto]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, procurement_dto_1.UpdateProcurementDto]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/inquiries'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, procurement_dto_1.CreateInquiryDto]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "addInquiry", null);
__decorate([
    (0, common_1.Post)(':id/inquiries/:inquiryId/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('inquiryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "confirmInquiry", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('stats/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "getDashboardStats", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, common_1.Controller)('procurements'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], ProcurementController);
//# sourceMappingURL=procurement.controller.js.map
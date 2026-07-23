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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const quote_service_1 = require("../services/quote.service");
const team_service_1 = require("../services/team.service");
const procurement_service_1 = require("../services/procurement.service");
const itinerary_service_1 = require("../services/itinerary.service");
let DashboardController = class DashboardController {
    quoteService;
    teamService;
    procurementService;
    itineraryService;
    constructor(quoteService, teamService, procurementService, itineraryService) {
        this.quoteService = quoteService;
        this.teamService = teamService;
        this.procurementService = procurementService;
        this.itineraryService = itineraryService;
    }
    async getStats() {
        const quoteStats = await this.quoteService.getDashboardStats();
        const teamStats = await this.teamService.getDashboardStats();
        const procurementStats = await this.procurementService.getDashboardStats();
        const itineraryStats = await this.itineraryService.getDashboardStats();
        return {
            quote: quoteStats,
            team: teamStats,
            procurement: procurementStats,
            itinerary: itineraryStats,
        };
    }
    async getTodoList() {
        return {
            data: [
                { id: 1, title: '日本本州6日游报价 - 张伟', type: '待审批', link: '/quotes/detail/1' },
                { id: 2, title: '首尔酒店采购 - 新罗酒店', type: '待询价', link: '/procurement/detail/2' },
                { id: 3, title: '巴厘岛车辆报价确认', type: '待确认', link: '/procurement/detail/3' },
                { id: 4, title: '泰国清迈7日游报价待发客户', type: '待发送', link: '/quotes/detail/4' },
                { id: 5, title: '欧洲三国12日行程待确认', type: '编辑中', link: '/itinerary/detail/5' },
            ],
            total: 5,
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('todo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTodoList", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [quote_service_1.QuoteService,
        team_service_1.TeamService,
        procurement_service_1.ProcurementService,
        itinerary_service_1.ItineraryService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map
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
exports.Procurement = exports.ProcurementStatus = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const resource_entity_1 = require("./resource.entity");
const quote_day_resource_entity_1 = require("./quote-day-resource.entity");
const procurement_inquiry_entity_1 = require("./procurement-inquiry.entity");
var ProcurementStatus;
(function (ProcurementStatus) {
    ProcurementStatus["PENDING"] = "\u5F85\u8BE2\u4EF7";
    ProcurementStatus["INQUIRING"] = "\u8BE2\u4EF7\u4E2D";
    ProcurementStatus["QUOTED"] = "\u62A5\u4EF7\u5B8C\u6210";
    ProcurementStatus["CONFIRMING"] = "\u5F85\u786E\u8BA4";
    ProcurementStatus["BOOKED"] = "\u5DF2\u9884\u8BA2\u5B8C\u6210";
    ProcurementStatus["CANCELLED"] = "\u5DF2\u53D6\u6D88";
})(ProcurementStatus || (exports.ProcurementStatus = ProcurementStatus = {}));
let Procurement = class Procurement {
    id;
    type;
    name;
    city;
    start_date;
    end_date;
    resource;
    resource_id;
    supplier;
    team;
    team_id;
    status;
    confirmed_price;
    quantity;
    remarks;
    inquiries;
    created_at;
    updated_at;
};
exports.Procurement = Procurement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Procurement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Procurement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Procurement.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Procurement.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Procurement.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Procurement.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resource_entity_1.Resource),
    __metadata("design:type", resource_entity_1.Resource)
], Procurement.prototype, "resource", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Procurement.prototype, "resource_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Procurement.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team),
    __metadata("design:type", team_entity_1.Team)
], Procurement.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Procurement.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: ProcurementStatus.PENDING,
    }),
    __metadata("design:type", String)
], Procurement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], Procurement.prototype, "confirmed_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Procurement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Procurement.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => procurement_inquiry_entity_1.ProcurementInquiry, inquiry => inquiry.procurement),
    __metadata("design:type", Array)
], Procurement.prototype, "inquiries", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Procurement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Procurement.prototype, "updated_at", void 0);
exports.Procurement = Procurement = __decorate([
    (0, typeorm_1.Entity)('procurements')
], Procurement);
//# sourceMappingURL=procurement.entity.js.map
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
exports.QuoteDayResource = exports.ResourceType = void 0;
const typeorm_1 = require("typeorm");
const quote_day_entity_1 = require("./quote-day.entity");
const resource_entity_1 = require("./resource.entity");
var ResourceType;
(function (ResourceType) {
    ResourceType["HOTEL"] = "\u9152\u5E97";
    ResourceType["VEHICLE"] = "\u8F66\u8F86";
    ResourceType["MEAL"] = "\u9910";
    ResourceType["GUIDE"] = "\u5BFC\u6E38";
    ResourceType["TICKET"] = "\u666F\u70B9\u7968";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
let QuoteDayResource = class QuoteDayResource {
    id;
    day;
    day_id;
    resource;
    resource_id;
    type;
    name;
    grade;
    detail;
    price;
    supplier;
    created_at;
    updated_at;
};
exports.QuoteDayResource = QuoteDayResource;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quote_day_entity_1.QuoteDay),
    __metadata("design:type", quote_day_entity_1.QuoteDay)
], QuoteDayResource.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "day_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resource_entity_1.Resource),
    __metadata("design:type", resource_entity_1.Resource)
], QuoteDayResource.prototype, "resource", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "resource_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], QuoteDayResource.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuoteDayResource.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuoteDayResource.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuoteDayResource.prototype, "updated_at", void 0);
exports.QuoteDayResource = QuoteDayResource = __decorate([
    (0, typeorm_1.Entity)('quote_day_resources')
], QuoteDayResource);
//# sourceMappingURL=quote-day-resource.entity.js.map
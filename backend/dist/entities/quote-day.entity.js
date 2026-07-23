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
exports.QuoteDay = void 0;
const typeorm_1 = require("typeorm");
const quote_entity_1 = require("./quote.entity");
const quote_day_resource_entity_1 = require("./quote-day-resource.entity");
let QuoteDay = class QuoteDay {
    id;
    quote;
    quote_id;
    day_num;
    date;
    city;
    resources;
    created_at;
    updated_at;
};
exports.QuoteDay = QuoteDay;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuoteDay.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quote_entity_1.Quote),
    __metadata("design:type", quote_entity_1.Quote)
], QuoteDay.prototype, "quote", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuoteDay.prototype, "quote_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QuoteDay.prototype, "day_num", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], QuoteDay.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuoteDay.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quote_day_resource_entity_1.QuoteDayResource, resource => resource.day),
    __metadata("design:type", Array)
], QuoteDay.prototype, "resources", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuoteDay.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuoteDay.prototype, "updated_at", void 0);
exports.QuoteDay = QuoteDay = __decorate([
    (0, typeorm_1.Entity)('quote_days')
], QuoteDay);
//# sourceMappingURL=quote-day.entity.js.map
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
exports.Quote = exports.QuoteType = exports.QuoteStatus = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("./user.entity");
const quote_day_entity_1 = require("./quote-day.entity");
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["DRAFT"] = "\u8349\u7A3F";
    QuoteStatus["PENDING"] = "\u5F85\u5BA1\u6279";
    QuoteStatus["SENT"] = "\u5DF2\u53D1\u9001\u5BA2\u6237";
    QuoteStatus["CONFIRMED"] = "\u5BA2\u6237\u786E\u8BA4";
    QuoteStatus["EXPIRED"] = "\u5931\u6548";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
var QuoteType;
(function (QuoteType) {
    QuoteType["GROUP"] = "\u6563\u56E2";
    QuoteType["CORPORATE"] = "\u4F01\u4E1A\u56E2\u5EFA";
    QuoteType["OFFICIAL"] = "\u516C\u52A1\u56E2";
    QuoteType["STUDY"] = "\u7814\u5B66\u56E2";
})(QuoteType || (exports.QuoteType = QuoteType = {}));
let Quote = class Quote {
    id;
    quote_no;
    name;
    customer;
    customer_id;
    type;
    people;
    departure_date;
    days;
    status;
    total_amount;
    cost_amount;
    remarks;
    created_by;
    created_by_id;
    days_data;
    created_at;
    updated_at;
};
exports.Quote = Quote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Quote.prototype, "quote_no", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quote.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    __metadata("design:type", customer_entity_1.Customer)
], Quote.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quote.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Quote.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Quote.prototype, "people", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Quote.prototype, "departure_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Quote.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: QuoteStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Quote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Quote.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Quote.prototype, "cost_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Quote.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quote.prototype, "created_by_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quote_day_entity_1.QuoteDay, day => day.quote),
    __metadata("design:type", Array)
], Quote.prototype, "days_data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Quote.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Quote.prototype, "updated_at", void 0);
exports.Quote = Quote = __decorate([
    (0, typeorm_1.Entity)('quotes')
], Quote);
//# sourceMappingURL=quote.entity.js.map
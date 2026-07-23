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
exports.ProcurementInquiry = exports.InquiryStatus = void 0;
const typeorm_1 = require("typeorm");
const procurement_entity_1 = require("./procurement.entity");
const user_entity_1 = require("./user.entity");
var InquiryStatus;
(function (InquiryStatus) {
    InquiryStatus["INITIATED"] = "\u5DF2\u53D1\u8D77";
    InquiryStatus["QUOTED"] = "\u62A5\u4EF7\u5B8C\u6210";
    InquiryStatus["CONFIRMED"] = "\u5DF2\u786E\u8BA4";
})(InquiryStatus || (exports.InquiryStatus = InquiryStatus = {}));
let ProcurementInquiry = class ProcurementInquiry {
    id;
    procurement;
    procurement_id;
    operator;
    operator_id;
    source;
    content;
    quoted_price;
    status;
    created_at;
};
exports.ProcurementInquiry = ProcurementInquiry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => procurement_entity_1.Procurement),
    __metadata("design:type", procurement_entity_1.Procurement)
], ProcurementInquiry.prototype, "procurement", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "procurement_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ProcurementInquiry.prototype, "operator", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "operator_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], ProcurementInquiry.prototype, "quoted_price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: InquiryStatus.INITIATED,
    }),
    __metadata("design:type", String)
], ProcurementInquiry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProcurementInquiry.prototype, "created_at", void 0);
exports.ProcurementInquiry = ProcurementInquiry = __decorate([
    (0, typeorm_1.Entity)('procurement_inquiries')
], ProcurementInquiry);
//# sourceMappingURL=procurement-inquiry.entity.js.map
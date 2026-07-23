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
exports.Itinerary = exports.ItineraryStatus = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
var ItineraryStatus;
(function (ItineraryStatus) {
    ItineraryStatus["DRAFT"] = "\u7F16\u8F91\u4E2D";
    ItineraryStatus["CONFIRMED"] = "\u5DF2\u786E\u8BA4";
    ItineraryStatus["EXECUTING"] = "\u6267\u884C\u4E2D";
    ItineraryStatus["COMPLETED"] = "\u5DF2\u5B8C\u6210";
})(ItineraryStatus || (exports.ItineraryStatus = ItineraryStatus = {}));
let Itinerary = class Itinerary {
    id;
    team;
    team_id;
    name;
    start_date;
    end_date;
    days;
    status;
    days_data;
    remarks;
    created_at;
    updated_at;
};
exports.Itinerary = Itinerary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Itinerary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team),
    __metadata("design:type", team_entity_1.Team)
], Itinerary.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Itinerary.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Itinerary.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Itinerary.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Itinerary.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Itinerary.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: ItineraryStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Itinerary.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Itinerary.prototype, "days_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Itinerary.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Itinerary.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Itinerary.prototype, "updated_at", void 0);
exports.Itinerary = Itinerary = __decorate([
    (0, typeorm_1.Entity)('itineraries')
], Itinerary);
//# sourceMappingURL=itinerary.entity.js.map
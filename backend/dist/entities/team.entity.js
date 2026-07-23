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
exports.Team = exports.TeamStatus = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("./user.entity");
const quote_entity_1 = require("./quote.entity");
const team_log_entity_1 = require("./team-log.entity");
var TeamStatus;
(function (TeamStatus) {
    TeamStatus["PENDING"] = "\u5F85\u751F\u6210";
    TeamStatus["FORMED"] = "\u5DF2\u6210\u56E2";
    TeamStatus["PROCURING"] = "\u91C7\u8D2D\u4E2D";
    TeamStatus["EXECUTING"] = "\u6267\u884C\u4E2D";
    TeamStatus["COMPLETED"] = "\u5DF2\u5B8C\u6210";
})(TeamStatus || (exports.TeamStatus = TeamStatus = {}));
let Team = class Team {
    id;
    team_no;
    customer;
    customer_id;
    quote;
    quote_id;
    quote_name;
    people;
    op;
    op_id;
    departure_date;
    return_date;
    status;
    remarks;
    logs;
    created_at;
    updated_at;
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Team.prototype, "team_no", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    __metadata("design:type", customer_entity_1.Customer)
], Team.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Team.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quote_entity_1.Quote),
    __metadata("design:type", quote_entity_1.Quote)
], Team.prototype, "quote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "quote_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "quote_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Team.prototype, "people", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Team.prototype, "op", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "op_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Team.prototype, "departure_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Team.prototype, "return_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: TeamStatus.PENDING,
    }),
    __metadata("design:type", String)
], Team.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => team_log_entity_1.TeamLog, log => log.team),
    __metadata("design:type", Array)
], Team.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Team.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Team.prototype, "updated_at", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)('teams')
], Team);
//# sourceMappingURL=team.entity.js.map
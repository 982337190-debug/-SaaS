"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv = __importStar(require("csv-writer"));
let FileService = class FileService {
    uploadDir = path.join(__dirname, '../../uploads');
    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async saveFile(file) {
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, filename);
        await fs.promises.writeFile(filePath, file.buffer);
        return `/uploads/${filename}`;
    }
    async getFile(filename) {
        const filePath = path.join(this.uploadDir, filename);
        return fs.promises.readFile(filePath);
    }
    async deleteFile(filename) {
        const filePath = path.join(this.uploadDir, filename);
        await fs.promises.unlink(filePath);
    }
    async exportQuotesToCsv(quotes) {
        const filename = `quotes-${Date.now()}.csv`;
        const filePath = path.join(this.uploadDir, filename);
        const csvWriter = csv.createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'quote_no', title: '报价单号' },
                { id: 'name', title: '产品名称' },
                { id: 'departure_date', title: '出发日期' },
                { id: 'days', title: '天数' },
                { id: 'status', title: '状态' },
                { id: 'people', title: '人数' },
                { id: 'total_amount', title: '总报价' },
                { id: 'created_at', title: '创建时间' },
            ],
        });
        const records = quotes.map((quote) => ({
            id: quote.id,
            quote_no: quote.quote_no,
            name: quote.name,
            departure_date: quote.departure_date.toISOString(),
            days: quote.days,
            status: quote.status,
            people: quote.people,
            total_amount: quote.total_amount,
            created_at: quote.created_at.toISOString(),
        }));
        await csvWriter.writeRecords(records);
        return `/uploads/${filename}`;
    }
    async exportTeamsToCsv(teams) {
        const filename = `teams-${Date.now()}.csv`;
        const filePath = path.join(this.uploadDir, filename);
        const csvWriter = csv.createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'team_no', title: '团号' },
                { id: 'quote_name', title: '产品名称' },
                { id: 'departure_date', title: '出发日期' },
                { id: 'return_date', title: '返程日期' },
                { id: 'status', title: '状态' },
                { id: 'people', title: '人数' },
                { id: 'created_at', title: '创建时间' },
            ],
        });
        const records = teams.map((team) => ({
            id: team.id,
            team_no: team.team_no,
            quote_name: team.quote_name,
            departure_date: team.departure_date.toISOString(),
            return_date: team.return_date?.toISOString() || '',
            status: team.status,
            people: team.people,
            created_at: team.created_at.toISOString(),
        }));
        await csvWriter.writeRecords(records);
        return `/uploads/${filename}`;
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileService);
//# sourceMappingURL=file.service.js.map
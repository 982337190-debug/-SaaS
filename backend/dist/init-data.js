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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitService = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const bcrypt = __importStar(require("bcryptjs"));
let InitService = class InitService {
    userRepo;
    roleRepo;
    permRepo;
    constructor(userRepo, roleRepo, permRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.permRepo = permRepo;
    }
    async init() {
        let exists = await this.userRepo.findOne({ where: { phone: '13800138000' } });
        if (!exists) {
            const adminRole = await this.roleRepo.save({ name: '管理员', code: 'admin' });
            await this.permRepo.save([
                { name: '用户管理', code: 'user:manage', module: 'system' },
                { name: '角色管理', code: 'role:manage', module: 'system' },
                { name: '权限管理', code: 'permission:manage', module: 'system' },
                { name: '报价管理', code: 'quote:manage', module: 'sales' },
                { name: '团组管理', code: 'team:manage', module: 'sales' },
                { name: '采购管理', code: 'procurement:manage', module: 'purchase' },
                { name: '资源管理', code: 'resource:manage', module: 'purchase' },
                { name: '行程管理', code: 'itinerary:manage', module: 'operation' },
                { name: '客户管理', code: 'customer:manage', module: 'sales' },
                { name: '区域配置', code: 'region:manage', module: 'system' },
            ]);
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = this.userRepo.create({
                phone: '13800138000',
                password: hashedPassword,
                name: '管理员',
                roles: [adminRole],
            });
            await this.userRepo.save(admin);
            console.log('初始化完成');
        }
        else {
            console.log('数据已存在');
        }
    }
};
exports.InitService = InitService;
exports.InitService = InitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InitService);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const initService = app.get(InitService);
    await initService.init();
    await app.close();
}
bootstrap().catch(console.error);
//# sourceMappingURL=init-data.js.map
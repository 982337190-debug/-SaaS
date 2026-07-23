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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const response_interceptor_1 = require("./interceptors/response.interceptor");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const bcrypt = __importStar(require("bcryptjs"));
async function initData(app) {
    const userRepo = app.get('UserRepository');
    const roleRepo = app.get('RoleRepository');
    const permRepo = app.get('PermissionRepository');
    const exists = await userRepo.findOne({ where: { phone: '13800138000' } });
    if (!exists) {
        const adminRole = await roleRepo.save({ name: '管理员', code: 'admin' });
        await permRepo.save([
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
        const admin = userRepo.create({
            phone: '13800138000',
            password: hashedPassword,
            name: '管理员',
            roles: [adminRole],
        });
        await userRepo.save(admin);
        console.log('初始化数据完成');
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    await initData(app);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
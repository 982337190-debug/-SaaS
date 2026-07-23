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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const serve_static_1 = require("@nestjs/serve-static");
const path = __importStar(require("path"));
const auth_controller_1 = require("./controllers/auth.controller");
const user_controller_1 = require("./controllers/user.controller");
const quote_controller_1 = require("./controllers/quote.controller");
const team_controller_1 = require("./controllers/team.controller");
const resource_controller_1 = require("./controllers/resource.controller");
const procurement_controller_1 = require("./controllers/procurement.controller");
const itinerary_controller_1 = require("./controllers/itinerary.controller");
const customer_controller_1 = require("./controllers/customer.controller");
const role_controller_1 = require("./controllers/role.controller");
const permission_controller_1 = require("./controllers/permission.controller");
const region_op_controller_1 = require("./controllers/region-op.controller");
const notification_controller_1 = require("./controllers/notification.controller");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const file_controller_1 = require("./controllers/file.controller");
const auth_service_1 = require("./services/auth.service");
const user_service_1 = require("./services/user.service");
const quote_service_1 = require("./services/quote.service");
const team_service_1 = require("./services/team.service");
const resource_service_1 = require("./services/resource.service");
const procurement_service_1 = require("./services/procurement.service");
const itinerary_service_1 = require("./services/itinerary.service");
const customer_service_1 = require("./services/customer.service");
const role_service_1 = require("./services/role.service");
const permission_service_1 = require("./services/permission.service");
const region_op_service_1 = require("./services/region-op.service");
const notification_service_1 = require("./services/notification.service");
const file_service_1 = require("./services/file.service");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const customer_entity_1 = require("./entities/customer.entity");
const quote_entity_1 = require("./entities/quote.entity");
const quote_day_entity_1 = require("./entities/quote-day.entity");
const quote_day_resource_entity_1 = require("./entities/quote-day-resource.entity");
const team_entity_1 = require("./entities/team.entity");
const team_log_entity_1 = require("./entities/team-log.entity");
const resource_entity_1 = require("./entities/resource.entity");
const procurement_entity_1 = require("./entities/procurement.entity");
const procurement_inquiry_entity_1 = require("./entities/procurement-inquiry.entity");
const itinerary_entity_1 = require("./entities/itinerary.entity");
const region_op_entity_1 = require("./entities/region-op.entity");
const notification_entity_1 = require("./entities/notification.entity");
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.join(__dirname, '../../uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: '/workspace/backend/database.sqlite',
                entities: [
                    user_entity_1.User,
                    role_entity_1.Role,
                    permission_entity_1.Permission,
                    customer_entity_1.Customer,
                    quote_entity_1.Quote,
                    quote_day_entity_1.QuoteDay,
                    quote_day_resource_entity_1.QuoteDayResource,
                    team_entity_1.Team,
                    team_log_entity_1.TeamLog,
                    resource_entity_1.Resource,
                    procurement_entity_1.Procurement,
                    procurement_inquiry_entity_1.ProcurementInquiry,
                    itinerary_entity_1.Itinerary,
                    region_op_entity_1.RegionOp,
                    notification_entity_1.Notification,
                ],
                synchronize: true,
                logging: true,
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: jwtSecret,
                signOptions: { expiresIn: '7d' },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                role_entity_1.Role,
                permission_entity_1.Permission,
                customer_entity_1.Customer,
                quote_entity_1.Quote,
                quote_day_entity_1.QuoteDay,
                quote_day_resource_entity_1.QuoteDayResource,
                team_entity_1.Team,
                team_log_entity_1.TeamLog,
                resource_entity_1.Resource,
                procurement_entity_1.Procurement,
                procurement_inquiry_entity_1.ProcurementInquiry,
                itinerary_entity_1.Itinerary,
                region_op_entity_1.RegionOp,
                notification_entity_1.Notification,
            ]),
        ],
        controllers: [
            auth_controller_1.AuthController,
            user_controller_1.UserController,
            quote_controller_1.QuoteController,
            team_controller_1.TeamController,
            resource_controller_1.ResourceController,
            procurement_controller_1.ProcurementController,
            itinerary_controller_1.ItineraryController,
            customer_controller_1.CustomerController,
            role_controller_1.RoleController,
            permission_controller_1.PermissionController,
            region_op_controller_1.RegionOpController,
            notification_controller_1.NotificationController,
            dashboard_controller_1.DashboardController,
            file_controller_1.FileController,
        ],
        providers: [
            auth_service_1.AuthService,
            user_service_1.UserService,
            quote_service_1.QuoteService,
            team_service_1.TeamService,
            resource_service_1.ResourceService,
            procurement_service_1.ProcurementService,
            itinerary_service_1.ItineraryService,
            customer_service_1.CustomerService,
            role_service_1.RoleService,
            permission_service_1.PermissionService,
            region_op_service_1.RegionOpService,
            notification_service_1.NotificationService,
            file_service_1.FileService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
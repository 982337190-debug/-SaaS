import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { QuoteController } from './controllers/quote.controller';
import { TeamController } from './controllers/team.controller';
import { ResourceController } from './controllers/resource.controller';
import { ProcurementController } from './controllers/procurement.controller';
import { ItineraryController } from './controllers/itinerary.controller';
import { CustomerController } from './controllers/customer.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { RegionOpController } from './controllers/region-op.controller';
import { NotificationController } from './controllers/notification.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { FileController } from './controllers/file.controller';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { QuoteService } from './services/quote.service';
import { TeamService } from './services/team.service';
import { ResourceService } from './services/resource.service';
import { ProcurementService } from './services/procurement.service';
import { ItineraryService } from './services/itinerary.service';
import { CustomerService } from './services/customer.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RegionOpService } from './services/region-op.service';
import { NotificationService } from './services/notification.service';
import { FileService } from './services/file.service';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Customer } from './entities/customer.entity';
import { Quote } from './entities/quote.entity';
import { QuoteDay } from './entities/quote-day.entity';
import { QuoteDayResource } from './entities/quote-day-resource.entity';
import { Team } from './entities/team.entity';
import { TeamLog } from './entities/team-log.entity';
import { Resource } from './entities/resource.entity';
import { Procurement } from './entities/procurement.entity';
import { ProcurementInquiry } from './entities/procurement-inquiry.entity';
import { Itinerary } from './entities/itinerary.entity';
import { RegionOp } from './entities/region-op.entity';
import { Notification } from './entities/notification.entity';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: '/workspace/backend/database.sqlite',
      entities: [
        User,
        Role,
        Permission,
        Customer,
        Quote,
        QuoteDay,
        QuoteDayResource,
        Team,
        TeamLog,
        Resource,
        Procurement,
        ProcurementInquiry,
        Itinerary,
        RegionOp,
        Notification,
      ],
      synchronize: true,
      logging: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Customer,
      Quote,
      QuoteDay,
      QuoteDayResource,
      Team,
      TeamLog,
      Resource,
      Procurement,
      ProcurementInquiry,
      Itinerary,
      RegionOp,
      Notification,
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    QuoteController,
    TeamController,
    ResourceController,
    ProcurementController,
    ItineraryController,
    CustomerController,
    RoleController,
    PermissionController,
    RegionOpController,
    NotificationController,
    DashboardController,
    FileController,
  ],
  providers: [
    AuthService,
    UserService,
    QuoteService,
    TeamService,
    ResourceService,
    ProcurementService,
    ItineraryService,
    CustomerService,
    RoleService,
    PermissionService,
    RegionOpService,
    NotificationService,
    FileService,
  ],
})
export class AppModule {}
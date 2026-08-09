import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import * as bcrypt from 'bcryptjs';

async function initData(app: any) {
  const userRepo: Repository<User> = app.get('UserRepository');
  const roleRepo: Repository<Role> = app.get('RoleRepository');
  const permRepo: Repository<Permission> = app.get('PermissionRepository');
  
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
      { name: '合同管理', code: 'contract:manage', module: 'purchase' },
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
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await initData(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

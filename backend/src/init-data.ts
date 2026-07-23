import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InitService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

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
    } else {
      console.log('数据已存在');
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const initService = app.get(InitService);
  await initService.init();
  await app.close();
}

bootstrap().catch(console.error);
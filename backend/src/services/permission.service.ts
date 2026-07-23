import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { name, description, module } = createPermissionDto;
    
    const existingPermission = await this.permissionRepository.findOne({ where: { name } });
    if (existingPermission) {
      throw new BadRequestException('权限名称已存在');
    }
    
    const permission = this.permissionRepository.create({ name, description, module });
    await this.permissionRepository.save(permission);
    return permission;
  }

  async findAll() {
    return this.permissionRepository.find();
  }

  async findOne(id: string) {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new BadRequestException('权限不存在');
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    await this.permissionRepository.save(permission);
    return permission;
  }

  async remove(id: string) {
    const permission = await this.findOne(id);
    await this.permissionRepository.delete(id);
    return { message: '权限已删除' };
  }

  async findByModule(module: string) {
    return this.permissionRepository.find({ where: { module } });
  }

  async getAllModules() {
    const result = await this.permissionRepository.query('SELECT DISTINCT module FROM permissions');
    return result.map(r => r.module).filter(Boolean);
  }
}
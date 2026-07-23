import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, permission_ids } = createRoleDto;
    
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new BadRequestException('角色名称已存在');
    }
    
    const role = this.roleRepository.create({ name, description });
    
    if (permission_ids && permission_ids.length > 0) {
      const permissions = await this.permissionRepository.findBy({ 
        id: In(permission_ids) 
      });
      role.permissions = permissions;
    }
    
    await this.roleRepository.save(role);
    return role;
  }

  async findAll() {
    return this.roleRepository.find({ relations: { permissions: true } });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ 
      where: { id }, 
      relations: { permissions: true } 
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    const { name, description, permission_ids } = updateRoleDto;
    
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    
    if (permission_ids !== undefined) {
      const permissions = await this.permissionRepository.findBy({ 
        id: In(permission_ids) 
      });
      role.permissions = permissions;
    }
    
    await this.roleRepository.save(role);
    return role;
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this.roleRepository.delete(id);
    return { message: '角色已删除' };
  }
}
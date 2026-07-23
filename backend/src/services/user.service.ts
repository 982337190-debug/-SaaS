import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { phone, password, name, email, region, position } = createUserDto;
    
    const existingUser = await this.userRepository.findOne({ where: { phone } });
    if (existingUser) {
      throw new BadRequestException('手机号已被注册');
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      phone,
      password: hashedPassword,
      name,
      email,
      region,
      position,
    });
    
    await this.userRepository.save(user);
    return user;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string) {
    const query = this.userRepository.createQueryBuilder('user');
    
    if (search) {
      query.where('user.name LIKE :search OR user.phone LIKE :search', { search: `%${search}%` });
    }
    
    const [users, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: users, total, page, pageSize };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: { roles: true },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);
    return { message: '用户已禁用' };
  }

  async assignRoles(id: string, assignRoleDto: AssignRoleDto) {
    const user = await this.findOne(id);
    const roles = await this.roleRepository.findBy({ 
      id: In(assignRoleDto.role_ids) 
    });
    user.roles = roles;
    await this.userRepository.save(user);
    return user;
  }

  async findByRegion(region: string) {
    return this.userRepository.find({ where: { region } });
  }
}
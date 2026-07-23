import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionOp } from '../entities/region-op.entity';
import { User } from '../entities/user.entity';
import { CreateRegionOpDto, UpdateRegionOpDto } from '../dto/region-op.dto';

@Injectable()
export class RegionOpService {
  constructor(
    @InjectRepository(RegionOp)
    private regionOpRepository: Repository<RegionOp>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createRegionOpDto: CreateRegionOpDto) {
    const { region, op_id, remark } = createRegionOpDto;
    
    const user = await this.userRepository.findOne({ where: { id: op_id } });
    if (!user) {
      throw new BadRequestException('OP用户不存在');
    }
    
    const existing = await this.regionOpRepository.findOne({ where: { region } });
    if (existing) {
      throw new BadRequestException('该区域已配置OP');
    }
    
    const regionOp = this.regionOpRepository.create({ region, op_id, remark });
    await this.regionOpRepository.save(regionOp);
    return regionOp;
  }

  async findAll() {
    return this.regionOpRepository.find({ relations: { op: true } });
  }

  async findOne(id: string) {
    const regionOp = await this.regionOpRepository.findOne({ where: { id }, relations: { op: true } });
    if (!regionOp) {
      throw new BadRequestException('区域OP配置不存在');
    }
    return regionOp;
  }

  async update(id: string, updateRegionOpDto: UpdateRegionOpDto) {
    const regionOp = await this.findOne(id);
    
    if (updateRegionOpDto.op_id) {
      const user = await this.userRepository.findOne({ where: { id: updateRegionOpDto.op_id } });
      if (!user) throw new BadRequestException('OP用户不存在');
    }
    
    Object.assign(regionOp, updateRegionOpDto);
    await this.regionOpRepository.save(regionOp);
    return regionOp;
  }

  async remove(id: string) {
    const regionOp = await this.findOne(id);
    await this.regionOpRepository.delete(id);
    return { message: '区域OP配置已删除' };
  }

  async findOpByRegion(region: string) {
    const regionOp = await this.regionOpRepository.findOne({ where: { region }, relations: { op: true } });
    return regionOp?.op;
  }

  async getAllRegions() {
    const result = await this.regionOpRepository.query('SELECT DISTINCT region FROM region_ops');
    return result.map(r => r.region);
  }
}
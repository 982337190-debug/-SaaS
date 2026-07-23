import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamStatus } from '../entities/team.entity';
import { TeamLog } from '../entities/team-log.entity';
import { Customer } from '../entities/customer.entity';
import { Quote } from '../entities/quote.entity';
import { RegionOp } from '../entities/region-op.entity';
import { User } from '../entities/user.entity';
import { CreateTeamDto, UpdateTeamDto, UpdateTeamStatusDto } from '../dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamLog)
    private teamLogRepository: Repository<TeamLog>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
    @InjectRepository(RegionOp)
    private regionOpRepository: Repository<RegionOp>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  generateTeamNo(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TM${year}${month}${day}${random}`;
  }

  async create(createTeamDto: CreateTeamDto, userId: string) {
    const { customer_id, quote_id, quote_name, people, op_id, departure_date, return_date, remarks } = createTeamDto;
    
    const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new BadRequestException('客户不存在');
    }
    
    let region = '';
    if (quote_id) {
      const quote = await this.quoteRepository.findOne({ where: { id: quote_id } });
      if (!quote) throw new BadRequestException('报价不存在');
      region = this.extractRegionFromQuote(quote);
    }
    
    let assignedOpId = op_id;
    if (!assignedOpId && region) {
      const regionOp = await this.regionOpRepository.findOne({ where: { region } });
      if (regionOp) {
        assignedOpId = regionOp.op_id;
      }
    }
    
    const teamNo = this.generateTeamNo();
    const team = this.teamRepository.create({
      team_no: teamNo,
      customer_id,
      quote_id,
      quote_name,
      people,
      op_id: assignedOpId,
      departure_date,
      return_date,
      remarks,
      status: TeamStatus.FORMED,
    });
    
    await this.teamRepository.save(team);
    
    await this.createLog(team.id, userId, '团队创建', quote_name ? `报价确认后自动生成团队: ${quote_name}` : '手动创建团队');
    
    if (assignedOpId) {
      await this.createLog(team.id, userId, 'OP分配', `系统按区域规则匹配主OP`);
    }
    
    return team;
  }

  extractRegionFromQuote(quote: Quote): string {
    const regionMap: Record<string, string> = {
      '日本': '日本区',
      '东京': '日本区',
      '大阪': '日本区',
      '京都': '日本区',
      '泰国': '东南亚区',
      '清迈': '东南亚区',
      '巴厘岛': '东南亚区',
      '越南': '东南亚区',
      '新加坡': '东南亚区',
      '韩国': '韩国区',
      '首尔': '韩国区',
      '济州': '韩国区',
      '欧洲': '欧洲区',
      '澳洲': '大洋洲区',
      '迪拜': '中东区',
    };
    
    for (const key of Object.keys(regionMap)) {
      if (quote.name.includes(key)) {
        return regionMap[key];
      }
    }
    return '';
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string, status?: string) {
    const query = this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.customer', 'customer')
      .leftJoinAndSelect('team.op', 'op');
    
    if (search) {
      query.where('team.team_no LIKE :search OR customer.name LIKE :search OR team.quote_name LIKE :search', { search: `%${search}%` });
    }
    
    if (status) {
      query.andWhere('team.status = :status', { status });
    }
    
    const [teams, total] = await query
      .orderBy('team.departure_date', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: teams, total, page, pageSize };
  }

  async findOne(id: string) {
    const team = await this.teamRepository.findOne({ 
      where: { id },
      relations: { customer: true, op: true, logs: true },
    });
    if (!team) {
      throw new BadRequestException('团队不存在');
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    await this.teamRepository.save(team);
    return team;
  }

  async updateStatus(id: string, updateTeamStatusDto: UpdateTeamStatusDto, userId: string) {
    const team = await this.findOne(id);
    const { status, remark } = updateTeamStatusDto;
    
    team.status = status as TeamStatus;
    await this.teamRepository.save(team);
    
    await this.createLog(id, userId, '状态变更', remark || `团队状态变更为: ${status}`);
    
    return team;
  }

  async createLog(teamId: string, operatorId: string, title: string, description?: string) {
    const log = this.teamLogRepository.create({
      team_id: teamId,
      operator_id: operatorId,
      title,
      description,
    });
    await this.teamLogRepository.save(log);
  }

  async getDashboardStats() {
    const total = await this.teamRepository.count();
    const active = await this.teamRepository.count({ where: { status: TeamStatus.EXECUTING } });
    const procuring = await this.teamRepository.count({ where: { status: TeamStatus.PROCURING } });
    
    return { total, active, procuring };
  }
}
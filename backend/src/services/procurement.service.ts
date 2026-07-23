import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procurement, ProcurementStatus } from '../entities/procurement.entity';
import { ProcurementInquiry, InquiryStatus } from '../entities/procurement-inquiry.entity';
import { Team } from '../entities/team.entity';
import { Resource } from '../entities/resource.entity';
import { ResourceType } from '../entities/quote-day-resource.entity';
import { CreateProcurementDto, UpdateProcurementDto, CreateInquiryDto } from '../dto/procurement.dto';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(Procurement)
    private procurementRepository: Repository<Procurement>,
    @InjectRepository(ProcurementInquiry)
    private procurementInquiryRepository: Repository<ProcurementInquiry>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(createProcurementDto: CreateProcurementDto, userId: string) {
    const { type, name, city, start_date, end_date, resource_id, supplier, team_id, quantity, remarks } = createProcurementDto;
    
    const team = await this.teamRepository.findOne({ where: { id: team_id } });
    if (!team) {
      throw new BadRequestException('团队不存在');
    }
    
    let resource: Resource | null = null;
    if (resource_id) {
      resource = await this.resourceRepository.findOne({ where: { id: resource_id } });
      if (!resource) throw new BadRequestException('资源不存在');
    }
    
    const procurement = this.procurementRepository.create({
      type: type as ResourceType,
      name,
      city,
      start_date,
      end_date,
      resource_id,
      supplier: supplier || resource?.supplier,
      team_id,
      quantity,
      remarks,
      status: ProcurementStatus.PENDING,
    });
    
    await this.procurementRepository.save(procurement);
    
    if (procurement.status === ProcurementStatus.PENDING) {
      const inquiry = this.procurementInquiryRepository.create({
        procurement_id: procurement.id,
        operator_id: userId,
        source: 'OP录入',
        content: `${name} 询价发起`,
        status: InquiryStatus.INITIATED,
      });
      await this.procurementInquiryRepository.save(inquiry);
    }
    
    return procurement;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string, type?: string, status?: string) {
    const query = this.procurementRepository.createQueryBuilder('procurement')
      .leftJoinAndSelect('procurement.team', 'team')
      .leftJoinAndSelect('procurement.resource', 'resource');
    
    if (search) {
      query.where('procurement.name LIKE :search OR procurement.supplier LIKE :search OR procurement.city LIKE :search', { search: `%${search}%` });
    }
    
    if (type) {
      query.andWhere('procurement.type = :type', { type });
    }
    
    if (status) {
      query.andWhere('procurement.status = :status', { status });
    }
    
    const [procurements, total] = await query
      .orderBy('procurement.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: procurements, total, page, pageSize };
  }

  async findOne(id: string) {
    const procurement = await this.procurementRepository.findOne({ 
      where: { id },
      relations: { team: true, resource: true, inquiries: true },
    });
    if (!procurement) {
      throw new BadRequestException('采购记录不存在');
    }
    return procurement;
  }

  async update(id: string, updateProcurementDto: UpdateProcurementDto) {
    const procurement = await this.findOne(id);
    Object.assign(procurement, updateProcurementDto);
    await this.procurementRepository.save(procurement);
    return procurement;
  }

  async addInquiry(id: string, createInquiryDto: CreateInquiryDto, userId: string) {
    const procurement = await this.findOne(id);
    
    const inquiry = this.procurementInquiryRepository.create({
      procurement_id: id,
      operator_id: userId,
      source: createInquiryDto.source,
      content: createInquiryDto.content,
      quoted_price: createInquiryDto.quoted_price,
      status: createInquiryDto.quoted_price ? InquiryStatus.QUOTED : InquiryStatus.INITIATED,
    });
    
    await this.procurementInquiryRepository.save(inquiry);
    
    if (createInquiryDto.quoted_price && procurement.status === ProcurementStatus.INQUIRING) {
      procurement.status = ProcurementStatus.QUOTED;
      procurement.confirmed_price = createInquiryDto.quoted_price;
      await this.procurementRepository.save(procurement);
    }
    
    return inquiry;
  }

  async confirmInquiry(id: string, inquiryId: string, userId: string) {
    const procurement = await this.findOne(id);
    const inquiry = await this.procurementInquiryRepository.findOne({ where: { id: inquiryId } });
    
    if (!inquiry) {
      throw new BadRequestException('询价记录不存在');
    }
    
    inquiry.status = InquiryStatus.CONFIRMED;
    await this.procurementInquiryRepository.save(inquiry);
    
    procurement.status = ProcurementStatus.BOOKED;
    procurement.confirmed_price = inquiry.quoted_price;
    await this.procurementRepository.save(procurement);
    
    return procurement;
  }

  async updateStatus(id: string, status: string) {
    const procurement = await this.findOne(id);
    procurement.status = status as ProcurementStatus;
    await this.procurementRepository.save(procurement);
    return procurement;
  }

  async getDashboardStats() {
    const total = await this.procurementRepository.count();
    const pending = await this.procurementRepository.count({ where: { status: ProcurementStatus.PENDING } });
    const inquiring = await this.procurementRepository.count({ where: { status: ProcurementStatus.INQUIRING } });
    const booked = await this.procurementRepository.count({ where: { status: ProcurementStatus.BOOKED } });
    
    return { total, pending, inquiring, booked };
  }
}
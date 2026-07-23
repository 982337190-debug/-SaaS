import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus, QuoteType } from '../entities/quote.entity';
import { QuoteDay } from '../entities/quote-day.entity';
import { QuoteDayResource } from '../entities/quote-day-resource.entity';
import { Customer } from '../entities/customer.entity';
import { Team } from '../entities/team.entity';
import { TeamStatus } from '../entities/team.entity';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
    @InjectRepository(QuoteDay)
    private quoteDayRepository: Repository<QuoteDay>,
    @InjectRepository(QuoteDayResource)
    private quoteDayResourceRepository: Repository<QuoteDayResource>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  generateQuoteNo(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `Q${year}${month}${day}${random}`;
  }

  async create(createQuoteDto: CreateQuoteDto, userId: string) {
    const { name, customer_id, type, people, departure_date, days, remarks, days_data } = createQuoteDto;
    
    const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new BadRequestException('客户不存在');
    }
    
    const quoteNo = this.generateQuoteNo();
    const quote = this.quoteRepository.create({
      quote_no: quoteNo,
      name,
      customer_id,
      type: type as QuoteType,
      people,
      departure_date: new Date(departure_date),
      days,
      remarks,
      created_by_id: userId,
    });
    
    await this.quoteRepository.save(quote);
    
    if (days_data && days_data.length > 0) {
      for (const dayDto of days_data) {
        const day = this.quoteDayRepository.create({
          quote_id: quote.id,
          day_num: dayDto.day_num,
          date: dayDto.date,
          city: dayDto.city,
        });
        await this.quoteDayRepository.save(day);
        
        for (const resourceDto of dayDto.resources) {
          const resource = this.quoteDayResourceRepository.create({
            day_id: day.id,
            resource_id: resourceDto.resource_id,
            type: resourceDto.type as any,
            name: resourceDto.name,
            grade: resourceDto.grade,
            detail: resourceDto.detail,
            price: resourceDto.price,
            supplier: resourceDto.supplier,
          });
          await this.quoteDayResourceRepository.save(resource);
        }
      }
    }
    
    return quote;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string, status?: string) {
    const query = this.quoteRepository.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.customer', 'customer');
    
    if (search) {
      query.where('quote.quote_no LIKE :search OR quote.name LIKE :search OR customer.name LIKE :search', { search: `%${search}%` });
    }
    
    if (status) {
      query.andWhere('quote.status = :status', { status });
    }
    
    const [quotes, total] = await query
      .orderBy('quote.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: quotes, total, page, pageSize };
  }

  async findOne(id: string) {
    const quote = await this.quoteRepository.findOne({ 
      where: { id },
      relations: { customer: true, days_data: { resources: true } },
    });
    if (!quote) {
      throw new BadRequestException('报价不存在');
    }
    return quote;
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    const quote = await this.findOne(id);
    
    if (quote.status === QuoteStatus.CONFIRMED || quote.status === QuoteStatus.EXPIRED) {
      throw new BadRequestException('已确认或失效的报价无法修改');
    }
    
    const { name, customer_id, type, people, departure_date, days, remarks, days_data } = updateQuoteDto;
    
    if (name) quote.name = name;
    if (customer_id) {
      const customer = await this.customerRepository.findOne({ where: { id: customer_id } });
      if (!customer) throw new BadRequestException('客户不存在');
      quote.customer_id = customer_id;
    }
    if (type) quote.type = type as QuoteType;
    if (people) quote.people = people;
    if (departure_date) quote.departure_date = new Date(departure_date);
    if (days) quote.days = days;
    if (remarks) quote.remarks = remarks;
    
    await this.quoteRepository.save(quote);
    
    if (days_data) {
      await this.quoteDayResourceRepository.delete({ day_id: id });
      await this.quoteDayRepository.delete({ quote_id: id });
      
      for (const dayDto of days_data) {
        const day = this.quoteDayRepository.create({
          quote_id: quote.id,
          day_num: dayDto.day_num,
          date: dayDto.date,
          city: dayDto.city,
        });
        await this.quoteDayRepository.save(day);
        
        for (const resourceDto of dayDto.resources) {
          const resource = this.quoteDayResourceRepository.create({
            day_id: day.id,
            resource_id: resourceDto.resource_id,
            type: resourceDto.type as any,
            name: resourceDto.name,
            grade: resourceDto.grade,
            detail: resourceDto.detail,
            price: resourceDto.price,
            supplier: resourceDto.supplier,
          });
          await this.quoteDayResourceRepository.save(resource);
        }
      }
    }
    
    return quote;
  }

  async submitForApproval(id: string) {
    const quote = await this.findOne(id);
    if (quote.status !== QuoteStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的报价才能提交审批');
    }
    quote.status = QuoteStatus.PENDING;
    await this.quoteRepository.save(quote);
    return quote;
  }

  async approve(id: string) {
    const quote = await this.findOne(id);
    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException('只有待审批状态的报价才能审批');
    }
    quote.status = QuoteStatus.SENT;
    await this.quoteRepository.save(quote);
    return quote;
  }

  async sendToCustomer(id: string) {
    const quote = await this.findOne(id);
    if (quote.status !== QuoteStatus.SENT) {
      throw new BadRequestException('报价状态不正确');
    }
    quote.status = QuoteStatus.SENT;
    await this.quoteRepository.save(quote);
    return quote;
  }

  async confirm(id: string) {
    const quote = await this.findOne(id);
    if (quote.status !== QuoteStatus.SENT) {
      throw new BadRequestException('只有已发送客户的报价才能确认');
    }
    quote.status = QuoteStatus.CONFIRMED;
    await this.quoteRepository.save(quote);
    
    const teamNo = this.generateTeamNo();
    const team = this.teamRepository.create({
      team_no: teamNo,
      customer_id: quote.customer_id,
      quote_id: quote.id,
      quote_name: quote.name,
      people: quote.people,
      departure_date: quote.departure_date,
      status: TeamStatus.FORMED,
    });
    await this.teamRepository.save(team);
    
    return { quote, team };
  }

  generateTeamNo(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TM${year}${month}${day}${random}`;
  }

  async expire(id: string) {
    const quote = await this.findOne(id);
    quote.status = QuoteStatus.EXPIRED;
    await this.quoteRepository.save(quote);
    return quote;
  }

  async delete(id: string) {
    const quote = await this.findOne(id);
    if (quote.status !== QuoteStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的报价才能删除');
    }
    await this.quoteDayResourceRepository.delete({ day_id: id });
    await this.quoteDayRepository.delete({ quote_id: id });
    await this.quoteRepository.delete(id);
    return { message: '报价已删除' };
  }

  async getDashboardStats() {
    const total = await this.quoteRepository.count();
    const draft = await this.quoteRepository.count({ where: { status: QuoteStatus.DRAFT } });
    const pending = await this.quoteRepository.count({ where: { status: QuoteStatus.PENDING } });
    const confirmed = await this.quoteRepository.count({ where: { status: QuoteStatus.CONFIRMED } });
    
    return { total, draft, pending, confirmed };
  }
}
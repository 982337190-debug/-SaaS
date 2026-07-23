import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    await this.customerRepository.save(customer);
    return customer;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string) {
    const query = this.customerRepository.createQueryBuilder('customer')
      .where('customer.enabled = true');
    
    if (search) {
      query.andWhere('customer.name LIKE :search OR customer.contact LIKE :search', { search: `%${search}%` });
    }
    
    const [customers, total] = await query
      .orderBy('customer.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: customers, total, page, pageSize };
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({ where: { id, enabled: true } });
    if (!customer) {
      throw new BadRequestException('客户不存在');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    await this.customerRepository.save(customer);
    return customer;
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    customer.enabled = false;
    await this.customerRepository.save(customer);
    return { message: '客户已禁用' };
  }

  async findAllSimple() {
    return this.customerRepository.find({ 
      where: { enabled: true }, 
      select: { id: true, name: true } 
    });
  }
}
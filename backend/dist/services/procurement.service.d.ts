import { Repository } from 'typeorm';
import { Procurement } from '../entities/procurement.entity';
import { ProcurementInquiry } from '../entities/procurement-inquiry.entity';
import { Team } from '../entities/team.entity';
import { Resource } from '../entities/resource.entity';
import { CreateProcurementDto, UpdateProcurementDto, CreateInquiryDto } from '../dto/procurement.dto';
export declare class ProcurementService {
    private procurementRepository;
    private procurementInquiryRepository;
    private teamRepository;
    private resourceRepository;
    constructor(procurementRepository: Repository<Procurement>, procurementInquiryRepository: Repository<ProcurementInquiry>, teamRepository: Repository<Team>, resourceRepository: Repository<Resource>);
    create(createProcurementDto: CreateProcurementDto, userId: string): Promise<Procurement>;
    findAll(page?: number, pageSize?: number, search?: string, type?: string, status?: string): Promise<{
        data: Procurement[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Procurement>;
    update(id: string, updateProcurementDto: UpdateProcurementDto): Promise<Procurement>;
    addInquiry(id: string, createInquiryDto: CreateInquiryDto, userId: string): Promise<ProcurementInquiry>;
    confirmInquiry(id: string, inquiryId: string, userId: string): Promise<Procurement>;
    updateStatus(id: string, status: string): Promise<Procurement>;
    getDashboardStats(): Promise<{
        total: number;
        pending: number;
        inquiring: number;
        booked: number;
    }>;
}

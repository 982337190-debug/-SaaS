import { ProcurementService } from '../services/procurement.service';
import { CreateProcurementDto, UpdateProcurementDto, CreateInquiryDto } from '../dto/procurement.dto';
export declare class ProcurementController {
    private readonly procurementService;
    constructor(procurementService: ProcurementService);
    create(createProcurementDto: CreateProcurementDto): Promise<import("../entities/procurement.entity").Procurement>;
    findAll(page?: number, pageSize?: number, search?: string, type?: string, status?: string): Promise<{
        data: import("../entities/procurement.entity").Procurement[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/procurement.entity").Procurement>;
    update(id: string, updateProcurementDto: UpdateProcurementDto): Promise<import("../entities/procurement.entity").Procurement>;
    addInquiry(id: string, createInquiryDto: CreateInquiryDto): Promise<import("../entities/procurement-inquiry.entity").ProcurementInquiry>;
    confirmInquiry(id: string, inquiryId: string): Promise<import("../entities/procurement.entity").Procurement>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("../entities/procurement.entity").Procurement>;
    getDashboardStats(): Promise<{
        total: number;
        pending: number;
        inquiring: number;
        booked: number;
    }>;
}

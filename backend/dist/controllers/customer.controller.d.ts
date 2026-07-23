import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    create(createCustomerDto: CreateCustomerDto): Promise<import("../entities/customer.entity").Customer>;
    findAll(page?: number, pageSize?: number, search?: string): Promise<{
        data: import("../entities/customer.entity").Customer[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/customer.entity").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("../entities/customer.entity").Customer>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findAllSimple(): Promise<import("../entities/customer.entity").Customer[]>;
}

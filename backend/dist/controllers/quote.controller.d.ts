import { QuoteService } from '../services/quote.service';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';
export declare class QuoteController {
    private readonly quoteService;
    constructor(quoteService: QuoteService);
    create(createQuoteDto: CreateQuoteDto): Promise<import("../entities/quote.entity").Quote>;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: import("../entities/quote.entity").Quote[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/quote.entity").Quote>;
    update(id: string, updateQuoteDto: UpdateQuoteDto): Promise<import("../entities/quote.entity").Quote>;
    submitForApproval(id: string): Promise<import("../entities/quote.entity").Quote>;
    approve(id: string): Promise<import("../entities/quote.entity").Quote>;
    sendToCustomer(id: string): Promise<import("../entities/quote.entity").Quote>;
    confirm(id: string): Promise<{
        quote: import("../entities/quote.entity").Quote;
        team: import("../entities/team.entity").Team;
    }>;
    expire(id: string): Promise<import("../entities/quote.entity").Quote>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getDashboardStats(): Promise<{
        total: number;
        draft: number;
        pending: number;
        confirmed: number;
    }>;
}

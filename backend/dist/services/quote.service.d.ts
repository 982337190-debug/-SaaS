import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { QuoteDay } from '../entities/quote-day.entity';
import { QuoteDayResource } from '../entities/quote-day-resource.entity';
import { Customer } from '../entities/customer.entity';
import { Team } from '../entities/team.entity';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';
export declare class QuoteService {
    private quoteRepository;
    private quoteDayRepository;
    private quoteDayResourceRepository;
    private customerRepository;
    private teamRepository;
    constructor(quoteRepository: Repository<Quote>, quoteDayRepository: Repository<QuoteDay>, quoteDayResourceRepository: Repository<QuoteDayResource>, customerRepository: Repository<Customer>, teamRepository: Repository<Team>);
    generateQuoteNo(): string;
    create(createQuoteDto: CreateQuoteDto, userId: string): Promise<Quote>;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: Quote[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Quote>;
    update(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote>;
    submitForApproval(id: string): Promise<Quote>;
    approve(id: string): Promise<Quote>;
    sendToCustomer(id: string): Promise<Quote>;
    confirm(id: string): Promise<{
        quote: Quote;
        team: Team;
    }>;
    generateTeamNo(): string;
    expire(id: string): Promise<Quote>;
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

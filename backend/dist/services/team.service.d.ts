import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamLog } from '../entities/team-log.entity';
import { Customer } from '../entities/customer.entity';
import { Quote } from '../entities/quote.entity';
import { RegionOp } from '../entities/region-op.entity';
import { User } from '../entities/user.entity';
import { CreateTeamDto, UpdateTeamDto, UpdateTeamStatusDto } from '../dto/team.dto';
export declare class TeamService {
    private teamRepository;
    private teamLogRepository;
    private customerRepository;
    private quoteRepository;
    private regionOpRepository;
    private userRepository;
    constructor(teamRepository: Repository<Team>, teamLogRepository: Repository<TeamLog>, customerRepository: Repository<Customer>, quoteRepository: Repository<Quote>, regionOpRepository: Repository<RegionOp>, userRepository: Repository<User>);
    generateTeamNo(): string;
    create(createTeamDto: CreateTeamDto, userId: string): Promise<Team>;
    extractRegionFromQuote(quote: Quote): string;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: Team[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team>;
    updateStatus(id: string, updateTeamStatusDto: UpdateTeamStatusDto, userId: string): Promise<Team>;
    createLog(teamId: string, operatorId: string, title: string, description?: string): Promise<void>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        procuring: number;
    }>;
}

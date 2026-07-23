import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto, UpdateTeamStatusDto } from '../dto/team.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(createTeamDto: CreateTeamDto): Promise<import("../entities/team.entity").Team>;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: import("../entities/team.entity").Team[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/team.entity").Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<import("../entities/team.entity").Team>;
    updateStatus(id: string, updateTeamStatusDto: UpdateTeamStatusDto): Promise<import("../entities/team.entity").Team>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        procuring: number;
    }>;
}

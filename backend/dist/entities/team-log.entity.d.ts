import { Team } from './team.entity';
import { User } from './user.entity';
export declare class TeamLog {
    id: string;
    team: Team;
    team_id: string;
    operator: User;
    operator_id: string;
    title: string;
    description: string;
    created_at: Date;
}

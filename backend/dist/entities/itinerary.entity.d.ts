import { Team } from './team.entity';
export declare enum ItineraryStatus {
    DRAFT = "\u7F16\u8F91\u4E2D",
    CONFIRMED = "\u5DF2\u786E\u8BA4",
    EXECUTING = "\u6267\u884C\u4E2D",
    COMPLETED = "\u5DF2\u5B8C\u6210"
}
export declare class Itinerary {
    id: string;
    team: Team;
    team_id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    days: number;
    status: ItineraryStatus;
    days_data: any;
    remarks: string;
    created_at: Date;
    updated_at: Date;
}

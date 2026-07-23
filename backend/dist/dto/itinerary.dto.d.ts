export declare class CreateItineraryDto {
    team_id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    days: number;
    remarks?: string;
}
export declare class UpdateItineraryDto {
    name?: string;
    start_date?: Date;
    end_date?: Date;
    days?: number;
    remarks?: string;
}
export declare class UpdateItineraryStatusDto {
    status: string;
    remark?: string;
}

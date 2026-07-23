import { Team } from './team.entity';
import { Resource } from './resource.entity';
import { ResourceType } from './quote-day-resource.entity';
import { ProcurementInquiry } from './procurement-inquiry.entity';
export declare enum ProcurementStatus {
    PENDING = "\u5F85\u8BE2\u4EF7",
    INQUIRING = "\u8BE2\u4EF7\u4E2D",
    QUOTED = "\u62A5\u4EF7\u5B8C\u6210",
    CONFIRMING = "\u5F85\u786E\u8BA4",
    BOOKED = "\u5DF2\u9884\u8BA2\u5B8C\u6210",
    CANCELLED = "\u5DF2\u53D6\u6D88"
}
export declare class Procurement {
    id: string;
    type: ResourceType;
    name: string;
    city: string;
    start_date: Date;
    end_date: Date;
    resource: Resource;
    resource_id: string;
    supplier: string;
    team: Team;
    team_id: string;
    status: ProcurementStatus;
    confirmed_price: number;
    quantity: string;
    remarks: string;
    inquiries: ProcurementInquiry[];
    created_at: Date;
    updated_at: Date;
}

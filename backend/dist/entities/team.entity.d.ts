import { Customer } from './customer.entity';
import { User } from './user.entity';
import { Quote } from './quote.entity';
import { TeamLog } from './team-log.entity';
export declare enum TeamStatus {
    PENDING = "\u5F85\u751F\u6210",
    FORMED = "\u5DF2\u6210\u56E2",
    PROCURING = "\u91C7\u8D2D\u4E2D",
    EXECUTING = "\u6267\u884C\u4E2D",
    COMPLETED = "\u5DF2\u5B8C\u6210"
}
export declare class Team {
    id: string;
    team_no: string;
    customer: Customer;
    customer_id: string;
    quote: Quote;
    quote_id: string;
    quote_name: string;
    people: number;
    op: User;
    op_id: string;
    departure_date: Date;
    return_date: Date;
    status: TeamStatus;
    remarks: string;
    logs: TeamLog[];
    created_at: Date;
    updated_at: Date;
}

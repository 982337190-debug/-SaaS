import { Customer } from './customer.entity';
import { User } from './user.entity';
import { QuoteDay } from './quote-day.entity';
export declare enum QuoteStatus {
    DRAFT = "\u8349\u7A3F",
    PENDING = "\u5F85\u5BA1\u6279",
    SENT = "\u5DF2\u53D1\u9001\u5BA2\u6237",
    CONFIRMED = "\u5BA2\u6237\u786E\u8BA4",
    EXPIRED = "\u5931\u6548"
}
export declare enum QuoteType {
    GROUP = "\u6563\u56E2",
    CORPORATE = "\u4F01\u4E1A\u56E2\u5EFA",
    OFFICIAL = "\u516C\u52A1\u56E2",
    STUDY = "\u7814\u5B66\u56E2"
}
export declare class Quote {
    id: string;
    quote_no: string;
    name: string;
    customer: Customer;
    customer_id: string;
    type: QuoteType;
    people: number;
    departure_date: Date;
    days: number;
    status: QuoteStatus;
    total_amount: number;
    cost_amount: number;
    remarks: string;
    created_by: User;
    created_by_id: string;
    days_data: QuoteDay[];
    created_at: Date;
    updated_at: Date;
}

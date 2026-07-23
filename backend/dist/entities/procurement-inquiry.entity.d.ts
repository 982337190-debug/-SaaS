import { Procurement } from './procurement.entity';
import { User } from './user.entity';
export declare enum InquiryStatus {
    INITIATED = "\u5DF2\u53D1\u8D77",
    QUOTED = "\u62A5\u4EF7\u5B8C\u6210",
    CONFIRMED = "\u5DF2\u786E\u8BA4"
}
export declare class ProcurementInquiry {
    id: string;
    procurement: Procurement;
    procurement_id: string;
    operator: User;
    operator_id: string;
    source: string;
    content: string;
    quoted_price: number;
    status: InquiryStatus;
    created_at: Date;
}

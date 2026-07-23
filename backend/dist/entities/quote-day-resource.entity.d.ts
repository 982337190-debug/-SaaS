import { QuoteDay } from './quote-day.entity';
import { Resource } from './resource.entity';
export declare enum ResourceType {
    HOTEL = "\u9152\u5E97",
    VEHICLE = "\u8F66\u8F86",
    MEAL = "\u9910",
    GUIDE = "\u5BFC\u6E38",
    TICKET = "\u666F\u70B9\u7968"
}
export declare class QuoteDayResource {
    id: string;
    day: QuoteDay;
    day_id: string;
    resource: Resource;
    resource_id: string;
    type: ResourceType;
    name: string;
    grade: string;
    detail: string;
    price: number;
    supplier: string;
    created_at: Date;
    updated_at: Date;
}

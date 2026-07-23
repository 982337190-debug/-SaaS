import { QuoteDayDto } from './quote-day.dto';
export declare class CreateQuoteDto {
    name: string;
    customer_id: string;
    type: string;
    people: number;
    departure_date: string;
    days?: number;
    remarks?: string;
    days_data?: QuoteDayDto[];
}
export declare class UpdateQuoteDto {
    name?: string;
    customer_id?: string;
    type?: string;
    people?: number;
    departure_date?: string;
    days?: number;
    remarks?: string;
    days_data?: QuoteDayDto[];
}
export declare class SubmitQuoteDto {
    remark?: string;
}

import { Quote } from './quote.entity';
import { QuoteDayResource } from './quote-day-resource.entity';
export declare class QuoteDay {
    id: string;
    quote: Quote;
    quote_id: string;
    day_num: number;
    date: Date;
    city: string;
    resources: QuoteDayResource[];
    created_at: Date;
    updated_at: Date;
}

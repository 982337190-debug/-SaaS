import { QuoteDayResourceDto } from './quote-day-resource.dto';
export declare class QuoteDayDto {
    day_num: number;
    date: Date;
    city?: string;
    resources: QuoteDayResourceDto[];
}

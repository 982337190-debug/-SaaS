import { ResourceType } from './quote-day-resource.entity';
export declare class Resource {
    id: string;
    type: ResourceType;
    name: string;
    grade: string;
    city: string;
    supplier: string;
    price: number;
    price_unit: string;
    description: string;
    contact: string;
    enabled: boolean;
    created_at: Date;
    updated_at: Date;
}

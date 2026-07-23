export declare class CreateResourceDto {
    type: string;
    name: string;
    grade?: string;
    city?: string;
    supplier?: string;
    price?: number;
    price_unit?: string;
    description?: string;
    contact?: string;
    enabled?: boolean;
}
export declare class UpdateResourceDto {
    name?: string;
    grade?: string;
    city?: string;
    supplier?: string;
    price?: number;
    price_unit?: string;
    description?: string;
    contact?: string;
    enabled?: boolean;
}

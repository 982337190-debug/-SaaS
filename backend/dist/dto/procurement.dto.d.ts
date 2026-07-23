export declare class CreateProcurementDto {
    type: string;
    name: string;
    city?: string;
    start_date: Date;
    end_date?: Date;
    resource_id?: string;
    supplier?: string;
    team_id: string;
    quantity?: string;
    remarks?: string;
}
export declare class UpdateProcurementDto {
    name?: string;
    city?: string;
    start_date?: Date;
    end_date?: Date;
    resource_id?: string;
    supplier?: string;
    quantity?: string;
    remarks?: string;
}
export declare class CreateInquiryDto {
    source: string;
    content: string;
    quoted_price?: number;
}

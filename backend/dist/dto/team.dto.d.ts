export declare class CreateTeamDto {
    customer_id: string;
    quote_id?: string;
    quote_name?: string;
    people: number;
    op_id?: string;
    departure_date: Date;
    return_date?: Date;
    remarks?: string;
}
export declare class UpdateTeamDto {
    customer_id?: string;
    quote_id?: string;
    quote_name?: string;
    people?: number;
    op_id?: string;
    departure_date?: Date;
    return_date?: Date;
    remarks?: string;
}
export declare class UpdateTeamStatusDto {
    status: string;
    remark?: string;
}

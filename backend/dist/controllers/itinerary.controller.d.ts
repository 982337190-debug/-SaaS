import { ItineraryService } from '../services/itinerary.service';
import { CreateItineraryDto, UpdateItineraryDto, UpdateItineraryStatusDto } from '../dto/itinerary.dto';
export declare class ItineraryController {
    private readonly itineraryService;
    constructor(itineraryService: ItineraryService);
    create(createItineraryDto: CreateItineraryDto): Promise<import("../entities/itinerary.entity").Itinerary>;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: import("../entities/itinerary.entity").Itinerary[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../entities/itinerary.entity").Itinerary>;
    update(id: string, updateItineraryDto: UpdateItineraryDto): Promise<import("../entities/itinerary.entity").Itinerary>;
    updateStatus(id: string, updateItineraryStatusDto: UpdateItineraryStatusDto): Promise<import("../entities/itinerary.entity").Itinerary>;
    updateDaysData(id: string, body: {
        days_data: any;
    }): Promise<import("../entities/itinerary.entity").Itinerary>;
    getDashboardStats(): Promise<{
        total: number;
        executing: number;
    }>;
}

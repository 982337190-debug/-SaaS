import { Repository } from 'typeorm';
import { Itinerary } from '../entities/itinerary.entity';
import { Team } from '../entities/team.entity';
import { CreateItineraryDto, UpdateItineraryDto, UpdateItineraryStatusDto } from '../dto/itinerary.dto';
export declare class ItineraryService {
    private itineraryRepository;
    private teamRepository;
    constructor(itineraryRepository: Repository<Itinerary>, teamRepository: Repository<Team>);
    create(createItineraryDto: CreateItineraryDto): Promise<Itinerary>;
    findAll(page?: number, pageSize?: number, search?: string, status?: string): Promise<{
        data: Itinerary[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<Itinerary>;
    update(id: string, updateItineraryDto: UpdateItineraryDto): Promise<Itinerary>;
    updateStatus(id: string, updateItineraryStatusDto: UpdateItineraryStatusDto): Promise<Itinerary>;
    updateDaysData(id: string, daysData: any): Promise<Itinerary>;
    getDashboardStats(): Promise<{
        total: number;
        executing: number;
    }>;
}

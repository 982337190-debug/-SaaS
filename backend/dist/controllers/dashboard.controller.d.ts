import { QuoteService } from '../services/quote.service';
import { TeamService } from '../services/team.service';
import { ProcurementService } from '../services/procurement.service';
import { ItineraryService } from '../services/itinerary.service';
export declare class DashboardController {
    private readonly quoteService;
    private readonly teamService;
    private readonly procurementService;
    private readonly itineraryService;
    constructor(quoteService: QuoteService, teamService: TeamService, procurementService: ProcurementService, itineraryService: ItineraryService);
    getStats(): Promise<{
        quote: {
            total: number;
            draft: number;
            pending: number;
            confirmed: number;
        };
        team: {
            total: number;
            active: number;
            procuring: number;
        };
        procurement: {
            total: number;
            pending: number;
            inquiring: number;
            booked: number;
        };
        itinerary: {
            total: number;
            executing: number;
        };
    }>;
    getTodoList(): Promise<{
        data: {
            id: number;
            title: string;
            type: string;
            link: string;
        }[];
        total: number;
    }>;
}

import { Controller, Get } from '@nestjs/common';
import { QuoteService } from '../services/quote.service';
import { TeamService } from '../services/team.service';
import { ProcurementService } from '../services/procurement.service';
import { ItineraryService } from '../services/itinerary.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly teamService: TeamService,
    private readonly procurementService: ProcurementService,
    private readonly itineraryService: ItineraryService,
  ) {}

  @Get('stats')
  async getStats() {
    const quoteStats = await this.quoteService.getDashboardStats();
    const teamStats = await this.teamService.getDashboardStats();
    const procurementStats = await this.procurementService.getDashboardStats();
    const itineraryStats = await this.itineraryService.getDashboardStats();

    return {
      quote: quoteStats,
      team: teamStats,
      procurement: procurementStats,
      itinerary: itineraryStats,
    };
  }

  @Get('todo')
  async getTodoList() {
    return {
      data: [
        { id: 1, title: '日本本州6日游报价 - 张伟', type: '待审批', link: '/quotes/detail/1' },
        { id: 2, title: '首尔酒店采购 - 新罗酒店', type: '待询价', link: '/procurement/detail/2' },
        { id: 3, title: '巴厘岛车辆报价确认', type: '待确认', link: '/procurement/detail/3' },
        { id: 4, title: '泰国清迈7日游报价待发客户', type: '待发送', link: '/quotes/detail/4' },
        { id: 5, title: '欧洲三国12日行程待确认', type: '编辑中', link: '/itinerary/detail/5' },
      ],
      total: 5,
    };
  }
}
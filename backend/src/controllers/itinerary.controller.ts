import { Controller, Get, Post, Put, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ItineraryService } from '../services/itinerary.service';
import { CreateItineraryDto, UpdateItineraryDto, UpdateItineraryStatusDto } from '../dto/itinerary.dto';

@Controller('itineraries')
@UsePipes(new ValidationPipe({ transform: true }))
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  async create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itineraryService.create(createItineraryDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.itineraryService.findAll(page, pageSize, search, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itineraryService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateItineraryDto: UpdateItineraryDto) {
    return this.itineraryService.update(id, updateItineraryDto);
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateItineraryStatusDto: UpdateItineraryStatusDto) {
    return this.itineraryService.updateStatus(id, updateItineraryStatusDto);
  }

  @Put(':id/days-data')
  async updateDaysData(@Param('id') id: string, @Body() body: { days_data: any }) {
    return this.itineraryService.updateDaysData(id, body.days_data);
  }

  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.itineraryService.getDashboardStats();
  }
}
import { Controller, Get, Post, Put, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProcurementService } from '../services/procurement.service';
import { CreateProcurementDto, UpdateProcurementDto, CreateInquiryDto } from '../dto/procurement.dto';

@Controller('procurements')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Post()
  async create(@Body() createProcurementDto: CreateProcurementDto) {
    return this.procurementService.create(createProcurementDto, 'test-user-id');
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.procurementService.findAll(page, pageSize, search, type, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProcurementDto: UpdateProcurementDto) {
    return this.procurementService.update(id, updateProcurementDto);
  }

  @Post(':id/inquiries')
  async addInquiry(@Param('id') id: string, @Body() createInquiryDto: CreateInquiryDto) {
    return this.procurementService.addInquiry(id, createInquiryDto, 'test-user-id');
  }

  @Post(':id/inquiries/:inquiryId/confirm')
  async confirmInquiry(@Param('id') id: string, @Param('inquiryId') inquiryId: string) {
    return this.procurementService.confirmInquiry(id, inquiryId, 'test-user-id');
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.procurementService.updateStatus(id, body.status);
  }

  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.procurementService.getDashboardStats();
  }
}
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { QuoteService } from '../services/quote.service';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quoteService.create(createQuoteDto, 'test-user-id');
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.quoteService.findAll(page, pageSize, search, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @Post(':id/submit')
  async submitForApproval(@Param('id') id: string) {
    return this.quoteService.submitForApproval(id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return this.quoteService.approve(id);
  }

  @Post(':id/send')
  async sendToCustomer(@Param('id') id: string) {
    return this.quoteService.sendToCustomer(id);
  }

  @Post(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.quoteService.confirm(id);
  }

  @Post(':id/expire')
  async expire(@Param('id') id: string) {
    return this.quoteService.expire(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.quoteService.delete(id);
  }

  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.quoteService.getDashboardStats();
  }
}
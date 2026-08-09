import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import {
  ContractAuditActionDto,
  CreateContractFileDto,
  CreateContractDto,
  CreateContractTemplateDto,
  CreateContractVersionDto,
  StartContractAiAuditDto,
  UpdateContractDto,
} from '../dto/contract.dto';

@Controller('contracts')
@UsePipes(new ValidationPipe({ transform: true }))
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async create(@Body() createDto: CreateContractDto) {
    return this.contractService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('page_size') pageSize = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('contract_type') contractType?: string,
    @Query('supplier_id') supplierId?: string,
  ) {
    return this.contractService.findAll(Number(page), Number(pageSize), search, status, contractType, supplierId);
  }

  @Get('audit/list')
  async getAuditList(
    @Query('status') status?: string,
    @Query('supplier_id') supplierId?: string,
  ) {
    return this.contractService.getAuditList(status, supplierId);
  }

  @Get('templates')
  async getTemplates() {
    return this.contractService.getTemplates();
  }

  @Get('ai-task/:taskId')
  async getAiTask(@Param('taskId') taskId: string) {
    return this.contractService.getAiTask(taskId);
  }

  @Post('templates')
  async createTemplate(@Body() createDto: CreateContractTemplateDto) {
    return this.contractService.createTemplate(createDto);
  }

  @Put('templates/:id/enable')
  async enableTemplate(@Param('id') id: string) {
    return this.contractService.enableTemplate(id);
  }

  @Put('templates/:id/disable')
  async disableTemplate(@Param('id') id: string) {
    return this.contractService.disableTemplate(id);
  }

  @Get('reminders')
  async getReminders() {
    return this.contractService.getReminders();
  }

  @Get('statistics')
  async getStatistics() {
    return this.contractService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateContractDto) {
    return this.contractService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string) {
    return this.contractService.submit(id);
  }

  @Post(':id/ai-audit')
  async startAiAudit(@Param('id') id: string, @Body() dto: StartContractAiAuditDto) {
    return this.contractService.startAiAudit(id, dto);
  }

  @Post(':id/audit/pass')
  async auditPass(@Param('id') id: string, @Body() dto: ContractAuditActionDto) {
    return this.contractService.auditPass(id, dto);
  }

  @Post(':id/audit/reject')
  async auditReject(@Param('id') id: string, @Body() dto: ContractAuditActionDto) {
    return this.contractService.auditReject(id, dto);
  }

  @Post(':id/version')
  async createVersion(@Param('id') id: string, @Body() dto: CreateContractVersionDto) {
    return this.contractService.createVersion(id, dto);
  }

  @Post(':id/files')
  async addFile(@Param('id') id: string, @Body() dto: CreateContractFileDto) {
    return this.contractService.addFile(id, dto);
  }

  @Get(':id/versions')
  async getVersions(@Param('id') id: string) {
    return this.contractService.getVersions(id);
  }
}

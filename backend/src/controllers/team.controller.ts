import { Controller, Get, Post, Put, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto, UpdateTeamStatusDto } from '../dto/team.dto';

@Controller('teams')
@UsePipes(new ValidationPipe({ transform: true }))
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto, 'test-user-id');
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.teamService.findAll(page, pageSize, search, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateTeamStatusDto: UpdateTeamStatusDto) {
    return this.teamService.updateStatus(id, updateTeamStatusDto, 'test-user-id');
  }

  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.teamService.getDashboardStats();
  }
}
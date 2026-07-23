import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegionOpService } from '../services/region-op.service';
import { CreateRegionOpDto, UpdateRegionOpDto } from '../dto/region-op.dto';

@Controller('region-ops')
@UsePipes(new ValidationPipe({ transform: true }))
export class RegionOpController {
  constructor(private readonly regionOpService: RegionOpService) {}

  @Post()
  async create(@Body() createRegionOpDto: CreateRegionOpDto) {
    return this.regionOpService.create(createRegionOpDto);
  }

  @Get()
  async findAll() {
    return this.regionOpService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.regionOpService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRegionOpDto: UpdateRegionOpDto) {
    return this.regionOpService.update(id, updateRegionOpDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.regionOpService.remove(id);
  }

  @Get('region/:region')
  async findOpByRegion(@Param('region') region: string) {
    return this.regionOpService.findOpByRegion(region);
  }

  @Get('regions')
  async getAllRegions() {
    return this.regionOpService.getAllRegions();
  }
}
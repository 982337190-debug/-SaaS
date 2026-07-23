import { Controller, Get, Post, Put, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto, UpdateResourceDto } from '../dto/resource.dto';

@Controller('resources')
@UsePipes(new ValidationPipe({ transform: true }))
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(createResourceDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('city') city?: string,
  ) {
    return this.resourceService.findAll(page, pageSize, search, type, city);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string) {
    return this.resourceService.findByType(type);
  }

  @Get('city/:city')
  async findByCity(@Param('city') city: string) {
    return this.resourceService.findByCity(city);
  }

  @Get('types')
  async getTypes() {
    return this.resourceService.getTypes();
  }
}
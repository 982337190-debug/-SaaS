import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerary, ItineraryStatus } from '../entities/itinerary.entity';
import { Team } from '../entities/team.entity';
import { CreateItineraryDto, UpdateItineraryDto, UpdateItineraryStatusDto } from '../dto/itinerary.dto';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectRepository(Itinerary)
    private itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(createItineraryDto: CreateItineraryDto) {
    const { team_id, name, start_date, end_date, days, remarks } = createItineraryDto;
    
    const team = await this.teamRepository.findOne({ where: { id: team_id } });
    if (!team) {
      throw new BadRequestException('团队不存在');
    }
    
    const itinerary = this.itineraryRepository.create({
      team_id,
      name,
      start_date,
      end_date,
      days,
      remarks,
      status: ItineraryStatus.DRAFT,
    });
    
    await this.itineraryRepository.save(itinerary);
    return itinerary;
  }

  async findAll(page: number = 1, pageSize: number = 10, search?: string, status?: string) {
    const query = this.itineraryRepository.createQueryBuilder('itinerary')
      .leftJoinAndSelect('itinerary.team', 'team');
    
    if (search) {
      query.where('itinerary.name LIKE :search OR team.team_no LIKE :search', { search: `%${search}%` });
    }
    
    if (status) {
      query.andWhere('itinerary.status = :status', { status });
    }
    
    const [itineraries, total] = await query
      .orderBy('itinerary.start_date', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    
    return { data: itineraries, total, page, pageSize };
  }

  async findOne(id: string) {
    const itinerary = await this.itineraryRepository.findOne({ 
      where: { id },
      relations: { team: true },
    });
    if (!itinerary) {
      throw new BadRequestException('行程不存在');
    }
    return itinerary;
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    const itinerary = await this.findOne(id);
    Object.assign(itinerary, updateItineraryDto);
    await this.itineraryRepository.save(itinerary);
    return itinerary;
  }

  async updateStatus(id: string, updateItineraryStatusDto: UpdateItineraryStatusDto) {
    const itinerary = await this.findOne(id);
    itinerary.status = updateItineraryStatusDto.status as ItineraryStatus;
    await this.itineraryRepository.save(itinerary);
    return itinerary;
  }

  async updateDaysData(id: string, daysData: any) {
    const itinerary = await this.findOne(id);
    itinerary.days_data = daysData;
    await this.itineraryRepository.save(itinerary);
    return itinerary;
  }

  async getDashboardStats() {
    const total = await this.itineraryRepository.count();
    const executing = await this.itineraryRepository.count({ where: { status: ItineraryStatus.EXECUTING } });
    
    return { total, executing };
  }
}
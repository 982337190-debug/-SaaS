import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-writer';
import { Quote } from '../entities/quote.entity';
import { Team } from '../entities/team.entity';

@Injectable()
export class FileService {
  private uploadDir = path.join(__dirname, '../../uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: any): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return `/uploads/${filename}`;
  }

  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, filename);
    return fs.promises.readFile(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.unlink(filePath);
  }

  async exportQuotesToCsv(quotes: Quote[]): Promise<string> {
    const filename = `quotes-${Date.now()}.csv`;
    const filePath = path.join(this.uploadDir, filename);

    const csvWriter = csv.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'quote_no', title: '报价单号' },
        { id: 'name', title: '产品名称' },
        { id: 'departure_date', title: '出发日期' },
        { id: 'days', title: '天数' },
        { id: 'status', title: '状态' },
        { id: 'people', title: '人数' },
        { id: 'total_amount', title: '总报价' },
        { id: 'created_at', title: '创建时间' },
      ],
    });

    const records = quotes.map((quote) => ({
      id: quote.id,
      quote_no: quote.quote_no,
      name: quote.name,
      departure_date: quote.departure_date.toISOString(),
      days: quote.days,
      status: quote.status,
      people: quote.people,
      total_amount: quote.total_amount,
      created_at: quote.created_at.toISOString(),
    }));

    await csvWriter.writeRecords(records);
    return `/uploads/${filename}`;
  }

  async exportTeamsToCsv(teams: Team[]): Promise<string> {
    const filename = `teams-${Date.now()}.csv`;
    const filePath = path.join(this.uploadDir, filename);

    const csvWriter = csv.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'team_no', title: '团号' },
        { id: 'quote_name', title: '产品名称' },
        { id: 'departure_date', title: '出发日期' },
        { id: 'return_date', title: '返程日期' },
        { id: 'status', title: '状态' },
        { id: 'people', title: '人数' },
        { id: 'created_at', title: '创建时间' },
      ],
    });

    const records = teams.map((team) => ({
      id: team.id,
      team_no: team.team_no,
      quote_name: team.quote_name,
      departure_date: team.departure_date.toISOString(),
      return_date: team.return_date?.toISOString() || '',
      status: team.status,
      people: team.people,
      created_at: team.created_at.toISOString(),
    }));

    await csvWriter.writeRecords(records);
    return `/uploads/${filename}`;
  }
}
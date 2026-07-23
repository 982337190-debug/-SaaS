import { Quote } from '../entities/quote.entity';
import { Team } from '../entities/team.entity';
export declare class FileService {
    private uploadDir;
    constructor();
    saveFile(file: any): Promise<string>;
    getFile(filename: string): Promise<Buffer>;
    deleteFile(filename: string): Promise<void>;
    exportQuotesToCsv(quotes: Quote[]): Promise<string>;
    exportTeamsToCsv(teams: Team[]): Promise<string>;
}

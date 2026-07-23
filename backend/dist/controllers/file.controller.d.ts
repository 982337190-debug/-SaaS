import { FileService } from '../services/file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: any): Promise<{
        url: string;
    }>;
    downloadFile(filename: string): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        filename: string;
        headers: {
            'Content-Type': string;
            'Content-Disposition': string;
        };
    }>;
    deleteFile(filename: string): Promise<{
        message: string;
    }>;
    private getContentType;
}

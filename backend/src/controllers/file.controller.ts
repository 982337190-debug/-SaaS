import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import * as path from 'path';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const url = await this.fileService.saveFile(file);
    return { url };
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string) {
    const buffer = await this.fileService.getFile(filename);
    return {
      buffer,
      filename,
      headers: {
        'Content-Type': this.getContentType(filename),
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    };
  }

  @Delete('delete/:filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.fileService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.csv': 'text/csv',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}

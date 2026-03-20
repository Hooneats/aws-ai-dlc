import { Injectable, BadRequestException } from '@nestjs/common';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    if (!ALLOWED_MIMES.includes(file.mimetype)) throw new BadRequestException('지원하지 않는 이미지 형식입니다.');
    if (file.size > MAX_SIZE) throw new BadRequestException('이미지 크기는 5MB 이하여야 합니다.');
    return { imageUrl: `/uploads/${file.filename}` };
  }
}

import { BadRequestException } from '@nestjs/common';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => { service = new UploadService(); });

  // TC-BE-040
  it('should upload valid image', async () => {
    const file = { originalname: 'test.jpg', mimetype: 'image/jpeg', size: 1024 * 1024, filename: '123-test.jpg' } as Express.Multer.File;
    const result = await service.uploadImage(file);
    expect(result.imageUrl).toContain('123-test.jpg');
  });

  // TC-BE-041
  it('should reject invalid file type', async () => {
    const file = { originalname: 'test.exe', mimetype: 'application/x-msdownload', size: 1024, filename: 'test.exe' } as Express.Multer.File;
    await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
  });

  it('should reject file exceeding 5MB', async () => {
    const file = { originalname: 'big.jpg', mimetype: 'image/jpeg', size: 6 * 1024 * 1024, filename: 'big.jpg' } as Express.Multer.File;
    await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
  });
});

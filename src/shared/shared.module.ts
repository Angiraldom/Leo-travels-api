import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { UploadImagesService } from './service/upload-images.service';

@Module({
  providers: [EmailService, UploadImagesService],
  exports: [EmailService, UploadImagesService],
})
export class SharedModule {}

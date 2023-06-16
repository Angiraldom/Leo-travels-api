import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import configuration from '../../config';

@Injectable()
export class UploadImagesService {
  private s3: S3;
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.config.aws.key,
        secretAccessKey: this.config.aws.secret,
      },
      region: this.config.aws.region,
      signatureVersion: 'v4', // Especifica la versión de la firma
    });
  }

  upload(uploadParams: S3.PutObjectRequest) {
    return this.s3.upload(uploadParams);
  }
}

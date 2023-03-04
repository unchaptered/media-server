import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// layers

@Injectable()
export class AwsS3Service {
    
    constructor(
        private readonly configService: ConfigService
    ) { }

    async getPresignedUrl(key: string) {
        const client = new S3Client({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
            }
        });
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key + '.mp4',
            ContentType: 'video/png'
        });

        return await getSignedUrl(client, command, { expiresIn: 3600 * 100 });
    }

}



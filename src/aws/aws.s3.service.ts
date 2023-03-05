import fs from 'fs';
import path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// layers

@Injectable()
export class AwsS3Service {
    
    constructor(
        private readonly configService: ConfigService
    ) { }

    private getS3Client(): S3Client {
        return new S3Client({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
            }
        });
    }

    async downloadFile(key: string): Promise<{ videoPath: string }> {

        const videoPath = path.join(process.cwd(), 'videos', key);
        const isExists = fs.existsSync(videoPath);
        if (isExists) return { videoPath };

        const client = this.getS3Client();
        const command = new GetObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
        })
        const videoS3 = await client.send(command);
        const videoData = await videoS3.Body.transformToByteArray();
        await fs.promises.writeFile(videoPath, videoData, { encoding:'utf8' });

        return { videoPath };
     
    }

    async uploadFile(videoFilePath: string, key: string): Promise<void> {

        const videoFile = fs.readFileSync(videoFilePath, { encoding: 'utf8' });
        
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
            Body: videoFile
        })
        
        const client = this.getS3Client();
        await client.send(command);

        fs.unlinkSync(videoFilePath);

    }

    async getPresignedUrl(key: string) {
        const client = this.getS3Client();

        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: 'origin_' + key + '.mp4',
            ContentType: 'video/mp4'
        });

        return await getSignedUrl(client, command, { expiresIn: 3600 * 100 });
    }

}



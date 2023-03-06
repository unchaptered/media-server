import fs from 'fs';
import path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { WorkerException } from '@models/exceptions/custon.exception';

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
        try {
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
            await fs.promises.writeFile(videoPath, videoData);

            return { videoPath };
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 3');
        }
    }

    async uploadFile(videoFilePath: string, key: string): Promise<void> {
        try {
            const videoFile = fs.readFileSync(videoFilePath);

            const command = new PutObjectCommand({
                Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
                Key: key,
                Body: videoFile
            })

            const client = this.getS3Client();
            await client.send(command);

            const originFilePath = videoFilePath.replace('cvted_', 'origin_');

            fs.unlinkSync(videoFilePath);
            fs.unlinkSync(originFilePath);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 6');
        }
    }

    async isExistsFile(key: string): Promise<boolean> {

        try {

            /** HeadObjectCommand는 대상이 없을 경우 에러를 발생 */
            const command = new HeadObjectCommand({
                Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
                Key: key,
                
            });
            const client = this.getS3Client();
            await client.send(command);
            
            /**
             * HeadObjectCommand는 대상이 없을 경우 에러를 발생
             * 따라서, 에러가 발생하지 않았다면 객체가 있는 것
             */
            return true;

        } catch(err) {
            const message = err?.message;
            if (message === 'UnknownError') return false;
            else throw new WorkerException(err?.message, 'ERROR 8');
        }

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



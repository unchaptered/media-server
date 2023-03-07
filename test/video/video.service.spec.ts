
import 'reflect-metadata';

import { VideoService } from '@video/video.service';

import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '@aws/aws.s3.service';
import { AwsSqsService } from '@aws/aws.sqs.service';


describe('[UNIT] Video Service', () => {

    let sutVideoService: VideoService;

    beforeEach(() => sutVideoService = new VideoService(
        new AwsS3Service(new ConfigService()),
        new AwsSqsService(new ConfigService())
    ));

    describe('[REF]', () => {
        it('VideoService must be defined defined', () => expect(sutVideoService).toBeDefined())
        it('VideoService must be instance of VideoService', () => expect(sutVideoService).toBeInstanceOf(VideoService));

        it('VideoService.prototype.getImage must be defined', () => expect(sutVideoService.getImage).toBeDefined());
        it('VideoService.prototype.postPreSignedUrl must be defined', () => expect(sutVideoService.postPreSignedUrl).toBeDefined());
    });

});
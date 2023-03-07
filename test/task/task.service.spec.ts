
import 'reflect-metadata';

import { TaskService } from '@task/task.service';

import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '@aws/aws.s3.service';
import { ChalkService } from '@chalk/chalk.service';
import { AwsSqsService } from '@aws/aws.sqs.service';
import { FfmpegService } from '@ffmpeg/ffmpeg.service';
import { SemaphoreService } from '@semaphore/semaphore.service';

describe('[UNIT] Semaphore Service', () => {

    let sutTaskService: TaskService;

    beforeEach(() => sutTaskService = new TaskService(
        new SemaphoreService(),
        new AwsSqsService(
            new ConfigService()
        ),
        new AwsS3Service(
            new ConfigService()
        ),
        new FfmpegService(),
        new ChalkService()
    ));

    describe('[REF]', () => {
        it('TaskService must be defined defined', () => expect(sutTaskService).toBeDefined())
        it('TaskService must be instance of TaskService', () => expect(sutTaskService).toBeInstanceOf(TaskService));

        it('TaskService.prototype.toH264 must be defined', () => expect(sutTaskService.toH264).toBeDefined());
        it('TaskService.prototype.detectAboutFailToH264 must be defined', () => expect(sutTaskService.detectAboutFailToH264).toBeDefined());
    });

});
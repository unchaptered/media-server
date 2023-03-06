import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

import { AwsS3Service } from '@aws/aws.s3.service';
import { ChalkService } from '@chalk/chalk.service';
import { AwsSqsService } from '@aws/aws.sqs.service';
import { FfmpegService } from '@ffmpeg/ffmpeg.service';
import { SemaphoreService } from '@semaphore/semaphore.service';

import { WorkerException } from '@models/exceptions/custon.exception';

@Injectable()
export class TaskService {

    TASK_ID = 0;

    constructor(
        private readonly semaphoreService: SemaphoreService,

        private readonly sqsService: AwsSqsService,
        private readonly s3Service: AwsS3Service,

        private readonly ffmpegService: FfmpegService,
        private readonly chalk: ChalkService,
    ) {}

    @Cron('*/5 * * * * *')
    toH264(): Promise<void> {

        this.TASK_ID ++;

        if (!this.semaphoreService.isAvailableSemByTaskName('to264')) return;

        this.semaphoreService.getSemInstanceByTaskName('to264').take(async () => {

            const TASK_ID = this.TASK_ID;

            try {

                this.chalk.logStep(TASK_ID, '+');

                this.chalk.logStep(TASK_ID, 'STEP 1'); // [STEP 1] ReadyQueue 에서 구독 ✅
                const client = this.sqsService.getSQSClient();
                const msgInReadyQueue = await this.sqsService.subMsgInReadyQueue(client);
                if (msgInReadyQueue === undefined || msgInReadyQueue === null)
                    return this.chalk.logStep(TASK_ID, 'PASS 1');

                this.chalk.logStep(TASK_ID, 'STEP 2'); // [STEP 2] InProcessingQueue에 발행
                const s3Key = JSON.parse(msgInReadyQueue?.Body)?.Records[0]?.s3?.object?.key;
                const msgInInProcessingQueue = await this.sqsService.pubMsgIntoInProcessingQueue(client, s3Key);


                this.chalk.logStep(TASK_ID, 'STEP 3'); // [STEP 3] 동영상 다운로드 및 저장
                const { videoPath } = await this.s3Service.downloadFile(s3Key);


                this.chalk.logStep(TASK_ID, 'STEP 4') // [STEP 4] ReadyQueue 에서 삭제 ✅
                await this.sqsService.delMsgInReadyQueue(client, msgInReadyQueue);


                this.chalk.logStep(TASK_ID, 'STEP 5') // [STEP 5] 동영상 처리
                const { tempVideoPath, tempS3Key } = this.ffmpegService.toH264(videoPath, s3Key);


                this.chalk.logStep(TASK_ID, 'STEP 6') // [STEP 5] 동영상 업로드 후 삭제 
                await this.s3Service.uploadFile(tempVideoPath, tempS3Key);


                this.chalk.logStep(TASK_ID, 'STEP 7') // [STEP 7] InProcessingQueue 에서 삭제 ✅
                const msgInProcessingQueue2 = await this.sqsService.subMsgInInProcessingQueue(client, msgInInProcessingQueue);
                await this.sqsService.delMsgInProcessingQueue(client, msgInProcessingQueue2);

            } catch (err) {

                if (err instanceof WorkerException) this.chalk.logError(TASK_ID, err.STEPERR);
                else this.chalk.logError(TASK_ID, 'ERROR UNKOWN', err?.message ?? JSON.stringify(err));

            } finally {

                this.chalk.logStep(TASK_ID, '-');
                this.semaphoreService.getSemInstanceByTaskName('to264')?.leave();

            }
        });
        
    }

}
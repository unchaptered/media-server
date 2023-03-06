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

    MAIN_TASK_ID = 0;
    SUB_TASK_ID = 0;

    constructor(
        private readonly semaphoreService: SemaphoreService,

        private readonly sqsService: AwsSqsService,
        private readonly s3Service: AwsS3Service,

        private readonly ffmpegService: FfmpegService,
        private readonly chalk: ChalkService,
    ) { }

    /** 5초에 한번 */
    @Cron('*/5 * * * * *')
    toH264(): void {

        this.MAIN_TASK_ID++;

        if (!this.semaphoreService.isAvailableSemByTaskName('to264')) return;

        this.semaphoreService.getSemInstanceByTaskName('to264').take(async () => {

            const MAIN_ID = this.MAIN_TASK_ID;

            try {

                this.chalk.logStepOfToH264(MAIN_ID, '+');

                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 1'); // [STEP 1] ReadyQueue 에서 구독 ✅
                const client = this.sqsService.getSQSClient();
                const msgInReadyQueue = await this.sqsService.subMsgInReadyQueue(client);
                if (msgInReadyQueue === undefined || msgInReadyQueue === null)
                    return this.chalk.logStepOfToH264(MAIN_ID, 'PASS 1');

                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 2'); // [STEP 2] InProcessingQueue에 발행
                console.log(msgInReadyQueue);

                const s3Key = JSON.parse(msgInReadyQueue?.Body)?.Records[0]?.s3?.object?.key;
                const msgInInProcessingQueue = await this.sqsService.pubMsgIntoInProcessingQueue(client, s3Key);


                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 3'); // [STEP 3] 동영상 다운로드 및 저장
                const { videoPath } = await this.s3Service.downloadFile(s3Key);


                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 4') // [STEP 4] ReadyQueue 에서 삭제 ✅
                await this.sqsService.delMsgInReadyQueue(client, msgInReadyQueue);


                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 5') // [STEP 5] 동영상 처리
                const { tempVideoPath, tempS3Key } = this.ffmpegService.toH264(videoPath, s3Key);


                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 6') // [STEP 5] 동영상 업로드 후 삭제 
                await this.s3Service.uploadFile(tempVideoPath, tempS3Key);


                this.chalk.logStepOfToH264(MAIN_ID, 'STEP 7') // [STEP 7] InProcessingQueue 에서 삭제 ✅
                const msgInProcessingQueue2 = await this.sqsService.subMsgInInProcessingQueue(client, msgInInProcessingQueue);
                await this.sqsService.delMsgInProcessingQueue(client, msgInProcessingQueue2.Messages[0]);

            } catch (err) {

                if (err instanceof WorkerException) this.chalk.logErrorOfToH264(MAIN_ID, err.STEPERR);
                else this.chalk.logErrorOfToH264(MAIN_ID, 'ERROR UNKOWN', err?.message ?? JSON.stringify(err));

            } finally {

                this.chalk.logStepOfToH264(MAIN_ID, '-');
                this.semaphoreService.getSemInstanceByTaskName('to264')?.leave();

            }
        });

    }

    /** 7초에 한번 */
    @Cron('*/7 * * * * *')
    detectAboutFailToH264(): void {

        this.SUB_TASK_ID++;

        if (!this.semaphoreService.isAvailableSemByTaskName('detectAboutFailToH264')) return;

        this.semaphoreService.getSemInstanceByTaskName('detectAboutFailToH264').take(async () => {
            const TASK_ID = this.SUB_TASK_ID;
            try {

                this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, '+');
                
                
                this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'STEP 1');
                const client = this.sqsService.getSQSClient();
                const bulkMessageList = await this.sqsService.subBulkMsgInInProcessingQueue(client);
                if (bulkMessageList === undefined || bulkMessageList === null)
                    return this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'PASS 1');

                const { Messages } = bulkMessageList;
                if (Messages === undefined || Messages === null) 
                    return this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'PASS 1');

                for (const messageKey of Object.keys(Messages)) {

                    const message = Messages[messageKey];

                    const s3Key = message.Body;
                    const cvtedS3Key = s3Key.replace('origin_', 'cvted_');

                    const isExistsOriginVid = await this.s3Service.isExistsFile(s3Key);
                    const isExistsCvtedVid = await this.s3Service.isExistsFile(cvtedS3Key);

                    if (isExistsOriginVid === true && isExistsCvtedVid === false) {
                        // 분석이 성공하였고 분석본이 안올라가서 InProcessingQueue가 남은 경우

                        this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'STEP 2');
                        await this.sqsService.delMsgInProcessingQueue(client, message);
                        return await this.sqsService.pubMsgInReadyQueue(client, s3Key);

                    }

                    // 분석이 성공하였고 분석본이 올라갔는데 InProcessingQueue만 남은 경우
                    if (isExistsOriginVid === false)
                        this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'STEP 3');
                    // 분석이 실패하였고 원본이 사라져서 아무 것도 할 수 없는 경우
                    else 
                        this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, 'STEP 4');

                    await this.sqsService.delMsgInProcessingQueue(client, message);

                }

            } catch (err) {
                console.log(err);
            } finally {
                this.chalk.logStepOfDetectAboutFailTo264(TASK_ID, '-');
                this.semaphoreService.getSemInstanceByTaskName('detectAboutFailToH264')?.leave();
            }
        });


    }

}
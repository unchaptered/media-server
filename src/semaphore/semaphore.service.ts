import semaphore from 'semaphore';
import { Injectable } from '@nestjs/common';
import { AwsSqsService } from '@aws/aws.sqs.service';
import { AwsS3Service } from '@aws/aws.s3.service';
import { FfmpegService } from '@ffmpeg/ffmpeg.service';


// interface ISEMAPHORE {
//     capacity: number,
//     current: number,
//     queue: Array<any>,
//     firstHere: boolean,
//      available: (): boolean => {}
// }

@Injectable()
export class SemaphoreService {

    static sem: any;

    constructor(
        private readonly sqsService: AwsSqsService,
        private readonly s3Service: AwsS3Service,

        private readonly ffmpegService: FfmpegService
    ) {
        SemaphoreService.sem = semaphore(2);
    }

    private getSemInstance() {
        return SemaphoreService.sem;
    }

    private isAvailableSem(): boolean {
        return SemaphoreService.sem.available();
    }

    /** getTaskFunction은 일정 시간의 텀을 가지고 있는 작업자 함수를 반환합니다. */
    private getTaskFunction = (START_TID: number, END_TID: number, TIMEOUT: number) => {
        const taskFunction = async () => {
            
            this.s3Service
            this.sqsService
            
            console.log(`TaskService 시작 호출 : ${START_TID}`);
            
            // [STEP 1] ReadyQueue 에서 구독 ✅
            const client = this.sqsService.getSQSClient();
            const msgInReadyQueue = await this.sqsService.subMsgInReadyQueue(client);
            if (msgInReadyQueue === undefined || msgInReadyQueue === null) {
                console.log(`[NO VIDEO MSG] TaskService 종료 호출 : ${END_TID}`);
                return this.getSemInstance().leave();
            }

            const s3Key = JSON.parse(msgInReadyQueue?.Body)?.Records[0]?.s3?.object?.key;
            
            // [STEP 2] InProcessingQueue 에 발행 ✅
            const msgInInProcessingQueue = await this.sqsService.pubMsgIntoInProcessingQueue(client, s3Key);
            const { videoPath } = await this.s3Service.downloadFile(s3Key);

            // [STEP 3] ReadyQueue 에서 삭제 ✅
            await this.sqsService.delMsgInReadyQueue(client, msgInReadyQueue);
        
            // [STEP 4] 동영상 처리 ✅
            const { tempVideoPath, tempS3Key } = this.ffmpegService.toH264(videoPath, s3Key);

            // [STEP 5] 동영상 업로드 후 삭제 ✅ 
            await this.s3Service.uploadFile(tempVideoPath, tempS3Key);
            
            // [STEP 6] InProcessingQueue 에서 삭제 ✅
            const msgInProcessingQueue2 = await this.sqsService.subMsgInInProcessingQueue(client, msgInInProcessingQueue);
            await this.sqsService.delMsgInProcessingQueue(client, msgInProcessingQueue2);

            return console.log(`[VIDEO MSG] TaskService 종료 호출 : ${END_TID}`);

        }
        return taskFunction;
    }

    public addNewWorker(START_TID: number, END_TID: number, TIMEOUT: number) {
        if (this.isAvailableSem())
            this.getSemInstance().take(
                this.getTaskFunction(START_TID, END_TID, TIMEOUT));
    }

}
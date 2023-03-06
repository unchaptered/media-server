import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import dayjs from 'dayjs';

import { WOKRER_STEPERR_TYPE, WOKRER_TYPE, WORKER_CHALK_RECORD, WORKER_LOG_RECORD } from '@models/exceptions/custon.exception';

const messageMapForTo264: WORKER_LOG_RECORD = {
    '+': '작업자 추가',
    'STEP 1': 'ReadyQueue에서 구독',
    'STEP 2': 'InProcessingQueue에 발행',
    'STEP 3': '동영상 다운로드 및 저장',
    'STEP 4': 'ReadyQueue에서 삭제',
    'STEP 5': '동영상 처리',
    'STEP 6': '동영상 업로드 후 삭제',
    'STEP 7': 'InProcessingQueue 에서 삭제',

    'PASS 1': 'ReadyQueue에서 구독 대상 없음',
    
    'ERROR 1': 'ReadyQueue에서 에러 발생',
    'ERROR 2': 'InProcessingQueue에서 에러 발생',
    'ERROR 3': '동영상 다운로드 및 저장에서 에러 발생',
    'ERROR 4': 'ReadyQueue에서 삭제에서 에러 발생',
    'ERROR 5': '동영상 처리에서 에러 발생',
    'ERROR 6': '동영상 업로드 후 삭제에서 에러 발생',
    'ERROR 7': 'InProcessingQueue 에서 삭제에서 에러 발생',
    'ERROR 8': '-',

    '-': '작업자 삭제',
};
const messageMapForDetectAboutFailTo264: WORKER_LOG_RECORD = {
    '+': '작업자 추가',
    'STEP 1': 'InProcessingQueue에서 벌크 구독 (~10 count)',
    'STEP 2': '원본 비디오는 있으나 분석본이 업로드 되지 않음',
    'STEP 3': '원본 비디오는 있으나 InProcessingQueue가 없음',
    'STEP 4': '원본 비디오는 없고 분석본도 없음7',
    'STEP 5': '동영상 처리',
    'STEP 6': '동영상 업로드 후 삭제',
    'STEP 7': 'InProcessingQueue 에서 삭제',

    'PASS 1': 'ReadyQueue에서 구독 대상 없음',
    
    'ERROR 1': 'InProcessingQueue에서 벌크 구독 중에 문제 발생',
    'ERROR 2': 'InProcessingQueue에서 에러 발생',
    'ERROR 3': '-',
    'ERROR 4': '-',
    'ERROR 5': '-',
    'ERROR 6': '-',
    'ERROR 7': 'InProcessingQueue 에서 삭제에서 에러 발생',
    'ERROR 8': '동영상 메타 정보 조회 중에 에러 발생',

    '-': '작업자 삭제',
}

const chalkMap: WORKER_CHALK_RECORD = {
    '+': chalk.magenta,
    '-': chalk.magenta,

    'STEP 1': chalk.yellowBright,
    'STEP 2': chalk.yellowBright,
    'STEP 3': chalk.yellowBright,
    'STEP 4': chalk.yellowBright,
    'STEP 5': chalk.yellowBright,
    'STEP 6': chalk.yellowBright,
    'STEP 7': chalk.yellowBright,

    'ERROR 1': chalk.red,
    'ERROR 2': chalk.red,
    'ERROR 3': chalk.red,
    'ERROR 4': chalk.red,
    'ERROR 5': chalk.red,
    'ERROR 6': chalk.red,
    'ERROR 7': chalk.red,
    'ERROR 8': chalk.red,

    'PASS 1': chalk.gray
}


@Injectable()
export class ChalkService {
    
    private log: typeof console.log
    constructor() {
        this.log = console.log
    }

    async logStepOfToH264(ID: number, STEP: WOKRER_TYPE): Promise<void> {

        // console.log('[Task] 00001   - 2023. 03. 05 오후 5:23:13       LOG [STEP 0]');
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP +] 작업자 추가
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 1] ReadyQueue에서 구독
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 1--] ReadyQueue에서 구독
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 2] InProcessingQueue에 발행        [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 3] 동영상 다운로드 및 저장         [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 4] ReadyQueue에서 삭제             [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 5] 동영상 처리                     [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 6] 동영상 업로드 후 삭제           [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 7] InProcessingQueue 에서 삭제     [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP -] 작업자 삭제

        this.log(
            chalk.green(`[To264]   ${ID.toString().padStart(5, '0')}  -`),
            dayjs().format('YYYY. MM. DD. A h:mm:ss').replace('AM', '오전').replace('PM', '오후'),
            chalk.green('    LOG'),
            chalkMap[STEP](`[${STEP}]`),
            chalk.green(messageMapForTo264[STEP])
        )
    }

    async logErrorOfToH264(
        ID: number,
        STEPERR: WOKRER_STEPERR_TYPE | 'ERROR UNKOWN' = 'ERROR UNKOWN',
        UNHANDLE_MESSAGE?: any
    ): Promise<void> {

        this.log(
            chalk.green(`[To264]   ${ID.toString().padStart(5, '0')}  -`),
            dayjs().format('YYYY. MM. DD. A h:mm:ss').replace('AM', '오전').replace('PM', '오후'),
            chalk.green('    LOG'),
            chalk.red(`[${STEPERR}]`),
            chalk.green(messageMapForTo264[STEPERR] ?? UNHANDLE_MESSAGE));

    }


    async logStepOfDetectAboutFailTo264(ID: number, STEP: WOKRER_TYPE): Promise<void> {

        // console.log('[Task] 00001   - 2023. 03. 05 오후 5:23:13       LOG [STEP 0]');
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP +] 작업자 추가
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 1] ReadyQueue에서 구독
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 1--] ReadyQueue에서 구독
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 2] InProcessingQueue에 발행        [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 3] 동영상 다운로드 및 저장         [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 4] ReadyQueue에서 삭제             [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 5] 동영상 처리                     [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 6] 동영상 업로드 후 삭제           [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP 7] InProcessingQueue 에서 삭제     [origin_aa.mp4]
        // [Task] START_TID - 2023. 03.05 오후 5:23:13     LOG [STEP -] 작업자 삭제

        this.log(
            chalk.green(`[Fail264] ${ID.toString().padStart(5, '0')}  -`),
            dayjs().format('YYYY. MM. DD. A h:mm:ss').replace('AM', '오전').replace('PM', '오후'),
            chalk.green('    LOG'),
            chalkMap[STEP](`[${STEP}]`),
            chalk.green(messageMapForDetectAboutFailTo264[STEP])
        );

    }

    async logErrorOfDetectAboutFailTo264(
        ID: number,
        STEPERR: WOKRER_STEPERR_TYPE | 'ERROR UNKOWN' = 'ERROR UNKOWN',
        UNHANDLE_MESSAGE?: any
    ): Promise<void> {

        this.log(
            chalk.green(`[Fail264] ${ID.toString().padStart(5, '0')}  -`),
            dayjs().format('YYYY. MM. DD. A h:mm:ss').replace('AM', '오전').replace('PM', '오후'),
            chalk.green('    LOG'),
            chalk.red(`[${STEPERR}]`),
            chalk.green(messageMapForDetectAboutFailTo264[STEPERR] ?? UNHANDLE_MESSAGE));

    }

}
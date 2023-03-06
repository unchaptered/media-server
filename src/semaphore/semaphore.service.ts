import semaphore from 'semaphore';
import { Injectable } from '@nestjs/common';

type TASK_NAME = 'to264' | 'detectAboutFailToH264';
type TASK_MAP = Record<TASK_NAME, any>;

@Injectable()
export class SemaphoreService {

    static mainSemaphore: any;
    static subSemaphore: any;

    static taskMap: TASK_MAP;

    constructor() {
        SemaphoreService.mainSemaphore = semaphore(2);
        SemaphoreService.subSemaphore = semaphore(2);

        SemaphoreService.taskMap = {
            'to264': SemaphoreService.mainSemaphore,
            'detectAboutFailToH264': SemaphoreService.subSemaphore
        };
    }

    public getSemInstanceByTaskName(task: TASK_NAME) {
        return SemaphoreService.taskMap[task];
    }

    public isAvailableSemByTaskName(task: TASK_NAME): boolean {
        return SemaphoreService.taskMap[task].available();
    }


}
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

import { SemaphoreService } from '@semaphore/semaphore.service';

@Injectable()
export class TaskService {

    TASK_ID = 0;

    constructor(
        private readonly semaphoreService: SemaphoreService
    ) {}

    @Cron('*/5 * * * * *')
    handleCron() {

        this.TASK_ID ++;

        this.semaphoreService.addNewWorker(this.TASK_ID);
        
    }

}
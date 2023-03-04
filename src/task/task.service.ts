import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

import { SemaphoreService } from '@semaphore/semaphore.service';

@Injectable()
export class TaskService {

    START_TID = 0;
    END_TID = 0;
    TIMEOUT = 10_000;

    TEST_TIME = 10_000;

    constructor(
        private readonly semaphoreService: SemaphoreService
    ) {}

    @Cron('*/5 * * * * *')
    handleCron() {

        this.START_TID ++;
        this.END_TID ++;
        this.TIMEOUT ++;

        this.semaphoreService.addNewWorker(this.START_TID, this.START_TID, this.TIMEOUT);
        
    }

}
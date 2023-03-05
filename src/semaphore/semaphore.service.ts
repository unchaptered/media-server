import semaphore from 'semaphore';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SemaphoreService {

    static sem: any;

    constructor() {
        SemaphoreService.sem = semaphore(2);
    }

    public getSemInstance() {
        return SemaphoreService.sem;
    }

    public isAvailableSem(): boolean {
        return SemaphoreService.sem.available();
    }

}
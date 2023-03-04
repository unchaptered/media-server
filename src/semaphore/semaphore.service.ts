import semaphore from 'semaphore';
import { Injectable } from '@nestjs/common';


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

    constructor() {
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
        const taskFunction = () => {

            console.log(`TaskService 초기 호출 : ${START_TID}`);

            setTimeout(() => {

                console.log(`TaskService 종료 호출 : ${END_TID}`);
                this.getSemInstance().leave();

            }, TIMEOUT);

        }
        return taskFunction;
    }

    public addNewWorker(START_TID: number, END_TID: number, TIMEOUT: number) {
        if (this.isAvailableSem())
            this.getSemInstance().take(
                this.getTaskFunction(START_TID, END_TID, TIMEOUT));
    }

}
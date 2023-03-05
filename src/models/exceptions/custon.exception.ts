import chalk from 'chalk';

export type WORKER_CALL_TYPE = '+' | '-';
export type WORKER_STEP_TYPE = 'STEP 1' | 'STEP 2' | 'STEP 3' | 'STEP 4' | 'STEP 5' | 'STEP 6' | 'STEP 7';
export type WORKER_STEPPASS_TYPE = 'PASS 1';
export type WOKRER_STEPERR_TYPE = 'ERROR 1' | 'ERROR 2' | 'ERROR 3' | 'ERROR 4' | 'ERROR 5' | 'ERROR 6' | 'ERROR 7';
export type WOKRER_TYPE = WORKER_CALL_TYPE | WORKER_STEP_TYPE | WOKRER_STEPERR_TYPE | WORKER_STEPPASS_TYPE;

export type WORKER_LOG_RECORD = Record<WOKRER_TYPE, string>;
export type WORKER_CHALK_RECORD = Record<WOKRER_TYPE, typeof chalk.magenta | typeof chalk.yellow | typeof chalk.red>;


export class WorkerException extends Error {

    STEPERR: WOKRER_STEPERR_TYPE;

    constructor(message: string, STEPERR: WOKRER_STEPERR_TYPE) {
        super(message);

        this.STEPERR = STEPERR
    }
    
}
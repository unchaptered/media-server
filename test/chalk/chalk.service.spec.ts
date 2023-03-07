import 'reflect-metadata';

import { ChalkService } from '@chalk/chalk.service';

describe('[UNIT] FFmpeg Service', () => {

    let sutChalkService: ChalkService;

    beforeEach(() => sutChalkService = new ChalkService());

    describe('[REF]', () => {
        it('chalkService must be defined', () => expect(sutChalkService).toBeDefined());
        it('chalkService must be instanceof ChalkService', () => expect(sutChalkService).toBeInstanceOf(ChalkService));

        it('ChalkService.prototype.logStepOfToH264 must be defined', () => expect(sutChalkService.logStepOfToH264).toBeDefined());
        it('ChalkService.prototype.logErrorOfToH264 must be defined', () => expect(sutChalkService.logErrorOfToH264).toBeDefined());

        it('ChalkService.prototype.logStepOfDetectAboutFailTo264 must be defined', () => expect(sutChalkService.logStepOfDetectAboutFailTo264).toBeDefined());
        it('ChalkService.prototype.logErrorOfDetectAboutFailTo264 must be defined', () => expect(sutChalkService.logErrorOfDetectAboutFailTo264).toBeDefined());
    });

});
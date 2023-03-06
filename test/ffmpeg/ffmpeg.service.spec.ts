import 'reflect-metadata';

import { join } from 'path';
import { existsSync }  from 'fs';
import { execSync } from 'child_process';

import { FfmpegService } from "@ffmpeg/ffmpeg.service";

describe('[UNIT] FFmpeg Service', () => {

    let sutFfmpeg: FfmpegService;

    beforeEach(() => sutFfmpeg = new FfmpegService());

    describe('[REF]', () => {
        it('FfmpegService must be defined', () => expect(FfmpegService).toBeDefined());
        it('ffmpegService must be instanceof FFmpegService', () => expect(sutFfmpeg).toBeInstanceOf(FfmpegService));

        it('FfmpegService.prototype.toH264 must be defined', () => expect(sutFfmpeg.toH264).toBeDefined());
        it('FfmpegService.prototype.getToH264Command must be defined', () => expect(sutFfmpeg.getToH264Command).toBeDefined());
    });

    describe('[CORE]', () => {

        const sutVideo = 'origin_videos.mp4';

        it('FfmpegService.prototype.getToH264Command must be valid syntax', async () => {

            const inputVideoPath = join(process.cwd(), 'test', 'assets', sutVideo);
            const outputVideoPath = inputVideoPath.replace('origin_', 'cvted_');
            
            const cli = sutFfmpeg.getToH264Command(inputVideoPath, outputVideoPath);
            
            execSync(cli);
            expect(existsSync(outputVideoPath)).toBeTruthy();
            
        });

    });

});
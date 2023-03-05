import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { WorkerException } from '@models/exceptions/custon.exception';

@Injectable()
export class FfmpegService {

    /**
     * key는 'origin_aa.mp4'의 형태입니다.
     * 
     * @param filepath 
     * @param key { string }
     */
    toH264(videoPath: string, key: string): { tempVideoPath: string, tempS3Key: string } {
        try {
            // cvted_aa.mp4
            const tempS3Key = 'cvted_' + key.split('origin_').join('');
            const tempVideoPath = path.join(process.cwd(), 'videos', tempS3Key);
            const isExists = fs.existsSync(tempVideoPath);
            if (isExists) return { tempVideoPath, tempS3Key };

            execSync(`ffmpeg -i ${videoPath} -c:v libx264 -crf 23 -preset medium -c:a copy ${tempVideoPath}`, {
                windowsHide: true
            });
            return { tempVideoPath, tempS3Key }
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 2');
        }
    }

}



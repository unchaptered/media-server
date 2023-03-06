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
     * @param videoPath { string }  C:/~/videos/origin_aa.mp4
     * @param key { string } origin_aa.mp4
     */
    toH264(videoPath: string, key: string): { tempVideoPath: string, tempS3Key: string, isAlreadyExists: boolean } {
        try {

            console.log(videoPath, key);
            
            // cvted_aa.mp4
            const tempS3Key = key.replace('origin_', 'cvted_');
            // C:/~/videos/cvted_aa.mp4
            const tempVideoPath = path.join(process.cwd(), 'videos', tempS3Key);
            
            const isExists = fs.existsSync(tempVideoPath);
            if (isExists) return { tempVideoPath, tempS3Key, isAlreadyExists: true };

            execSync(this.getToH264Command(videoPath, tempVideoPath));
            
            return { tempVideoPath, tempS3Key, isAlreadyExists: false }
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 2');
        }
    }

    getToH264Command(inputVideoPath: string, outputVideoPath: string): string {
        const cli = `ffmpeg -i ${inputVideoPath} -c:v libx264 -crf 23 -preset medium -c:a copy ${outputVideoPath} -y`;
        return cli;
    }

}



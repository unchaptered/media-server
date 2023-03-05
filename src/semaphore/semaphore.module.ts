import { AwsModule } from '@aws/aws.module';
import { Module } from '@nestjs/common';

import { SemaphoreService } from '@semaphore/semaphore.service';
import { FfmpegModule } from '@ffmpeg/ffmpeg.module';
import { ChalkModule } from '@chalk/chalk.module';

@Module({
  imports: [AwsModule, FfmpegModule, ChalkModule],
  controllers: [],
  providers: [SemaphoreService],
  exports: [SemaphoreService]
})
export class SemaphoreModule {}
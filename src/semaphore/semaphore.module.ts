import { AwsModule } from '@aws/aws.module';
import { Module } from '@nestjs/common';

import { SemaphoreService } from '@semaphore/semaphore.service';
import { FfmpegModule } from '@ffmpeg/ffmpeg.module';

@Module({
  imports: [AwsModule, FfmpegModule],
  controllers: [],
  providers: [SemaphoreService],
  exports: [SemaphoreService]
})
export class SemaphoreModule {}
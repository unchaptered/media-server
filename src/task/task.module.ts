import { Module } from '@nestjs/common';

import { AwsModule } from '@aws/aws.module';
import { ChalkModule } from '@chalk/chalk.module';
import { FfmpegModule } from '@ffmpeg/ffmpeg.module';
import { SemaphoreModule } from '@semaphore/semaphore.module';

import { TaskService } from '@task/task.service';

@Module({
  imports: [SemaphoreModule, AwsModule, ChalkModule, FfmpegModule],
  controllers: [],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}

/**
 * TaskModule 에서 하는 작업이 있고.
 * Semaphore 는 작업의 호출, 관리, 성공, 실패에 대한 코드를 확장형으로 제공해야겠음
 */
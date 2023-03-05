import { Module } from '@nestjs/common';

import { SemaphoreService } from '@semaphore/semaphore.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SemaphoreService],
  exports: [SemaphoreService]
})
export class SemaphoreModule {}
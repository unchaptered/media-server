import { Module } from '@nestjs/common';
import { TaskService } from '@task/task.service';
import { SemaphoreModule } from '@semaphore/semaphore.module';

@Module({
  imports: [SemaphoreModule],
  controllers: [],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}

/**
 * TaskModule 에서 하는 작업이 있고.
 * Semaphore 는 작업의 호출, 관리, 성공, 실패에 대한 코드를 확장형으로 제공해야겠음
 */
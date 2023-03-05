import { Module } from '@nestjs/common';

import { ChalkService } from '@chalk/chalk.service';

@Module({
  providers: [ChalkService],
  exports: [ChalkService]
})
export class ChalkModule {}
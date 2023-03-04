import { Module } from '@nestjs/common';

// Layer
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
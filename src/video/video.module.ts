import { Module } from '@nestjs/common';

// Layer
import { VideoController } from '@video/video.controller';
import { VideoService } from '@video/video.service';

import { AwsModule } from '@aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
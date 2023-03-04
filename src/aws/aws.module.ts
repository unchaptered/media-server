import { Module } from '@nestjs/common';

import { AwsS3Service } from '@aws/aws.s3.service';
import { AwsCfService } from '@aws/aws.cf.service';
import { AwsSqsService } from '@aws/aws.sqs.service';

@Module({
  providers: [AwsS3Service, AwsCfService, AwsSqsService],
  exports: [AwsS3Service, AwsCfService, AwsSqsService]
})
export class AwsModule {}
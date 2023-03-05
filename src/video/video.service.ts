import { Injectable } from '@nestjs/common';

import { AwsS3Service } from '@aws/aws.s3.service';
import { AwsSqsService } from '@aws/aws.sqs.service';

@Injectable()
export class VideoService {
    
    constructor(
        private readonly awsS3Service: AwsS3Service,
        private readonly awsSqsService: AwsSqsService
    ) { }

    async postPreSignedUrl() {
        return await this.awsS3Service.getPresignedUrl('aa');
    }
    
    async getImage() {
        return await this.awsSqsService.getPrototype();
    }

}


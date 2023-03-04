import { Injectable } from '@nestjs/common';

import { AwsS3Service } from 'src/aws/aws.s3.service';
import { AwsSqsService } from 'src/aws/aws.sqs.service';

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
        return await this.awsSqsService.getSqsMessage();
    }

}


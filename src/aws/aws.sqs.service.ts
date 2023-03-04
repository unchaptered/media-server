import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand  } from '@aws-sdk/client-sqs';
import { SQSClient, ReceiveMessageCommand, SendMessageCommand, DeleteMessageCommand  } from '@aws-sdk/client-sqs';
// import { SQSClient, ReceiveMessageCommand  } from '@aws-sdk/client-sqs';

// layers

@Injectable()
export class AwsSqsService {
    
    constructor(
        private readonly configService: ConfigService
    ) { }

    async getSqsMessage() {

        const client = new SQSClient({
            region: this.configService.get('AWS_SQS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_SQS_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_SQS_SECRET_KEY'),
            }
        });

        // SEND 1 Ready Queue 에서 구독
        console.log('==============================SEND 1==============================');
        const command = new ReceiveMessageCommand({
            QueueUrl: this.configService.get('AWS_SQS_URL'),
            MaxNumberOfMessages: 1
        });
        const { Messages  } = await client.send(command);
        if (!Messages || Messages.length === 0) return '무야호!';
        
        const message = Messages[0];
        const imageKey = JSON.parse(message.Body).Records[0].s3.object.key
        
        //  SEND 2 Ready Queue 에 구독 해제
        console.log('==============================SEND 2==============================');
        const delCommand = new DeleteMessageCommand({
            QueueUrl: this.configService.get('AWS_SQS_READY_QUEUE_URL'),
            ReceiptHandle: message.ReceiptHandle
        })
        await client.send(delCommand);
        
        //  FFMPEG 을 가동
        
        //  SEND 3 In-Processing Queue 발행
        console.log('==============================SEND 3==============================');
        const sendCommand = new SendMessageCommand({
            QueueUrl: this.configService.get('AWS_SQS_IN_PROCESSING_QUEUE_URL'),
            MessageBody: imageKey
        });
        const sendResult = await client.send(sendCommand);
        
        //  SEND 4 In-Processing Queue 구독
        console.log('==============================SEND 4==============================');
        const receiveSendCommand = new ReceiveMessageCommand({
            QueueUrl: this.configService.get('AWS_SQS_IN_PROCESSING_QUEUE_URL'),
            ReceiveRequestAttemptId: sendResult.$metadata.requestId
        })
        const receiveSendResult = await client.send(receiveSendCommand);
        
        const deleteCommand = new DeleteMessageCommand({
            QueueUrl: this.configService.get('AWS_SQS_IN_PROCESSING_QUEUE_URL'),
            ReceiptHandle: receiveSendResult.Messages[0].ReceiptHandle
        })
        await client.send(deleteCommand);

        return JSON.parse(message?.Body)

    }

}



import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand  } from '@aws-sdk/client-sqs';
import { SQSClient, ReceiveMessageCommand, SendMessageCommand, DeleteMessageCommand, Message, SendMessageCommandOutput, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import { WorkerException } from '@models/exceptions/custon.exception';

type QUEUE_KEY = 'READY' | 'IN_PROCESSING';
type QUEUE_URL = 'AWS_SQS_READY_QUEUE_URL' | 'AWS_SQS_IN_PROCESSING_QUEUE_URL';
type QUEUE_MAP = Record<QUEUE_KEY, QUEUE_URL>;

@Injectable()
export class AwsSqsService {

    static queueMap: QUEUE_MAP = {
        READY: 'AWS_SQS_READY_QUEUE_URL',
        IN_PROCESSING: 'AWS_SQS_IN_PROCESSING_QUEUE_URL'
    };

    constructor(
        private readonly configService: ConfigService
    ) { }

    private getQueueURL(queue: QUEUE_KEY): QUEUE_URL {
        return AwsSqsService.queueMap[queue];
    }

    getSQSClient(): SQSClient {
        return new SQSClient({
            region: this.configService.get('AWS_SQS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_SQS_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_SQS_SECRET_KEY'),
            }
        });
    }

    /** @ReadyQueue */
    async subMsgInReadyQueue(client: SQSClient): Promise<Message | null> {

        try {

            const command = new ReceiveMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('READY')),
                MaxNumberOfMessages: 1
            });
            const { Messages } = await client.send(command);
            if (!Messages || Messages.length === 0) return null;
            else return Messages[0];

        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 1');
        }
    }

    /** @ReadyQueue */
    async pubMsgInReadyQueue(client: SQSClient, key: string): Promise<Message | null> {
        try {

            // S3 - SQS 원본 이벤트 형태
            const Records = {
                Records: [{ s3: { object: { key }}}]
            }
            const command = new SendMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('READY')),
                MessageBody: JSON.stringify(Records)
            });
            return await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 2');
        }
    }

    /** @ReadyQueue */
    async delMsgInReadyQueue(client: SQSClient, message: Message): Promise<void> {
        try {
            const command = new DeleteMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('READY')),
                ReceiptHandle: message.ReceiptHandle
            })
            await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 4');
        }
    }

    /** @InProcessingQueue */
    async subMsgInInProcessingQueue(client: SQSClient, message: SendMessageCommandOutput): Promise<ReceiveMessageCommandOutput> {
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('IN_PROCESSING')),
                ReceiveRequestAttemptId: message.$metadata.requestId
            })
            return await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 7');
        }
    }

    /** @InProcessingQueue */
    async subBulkMsgInInProcessingQueue(client: SQSClient): Promise<ReceiveMessageCommandOutput> {
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('IN_PROCESSING')),
                MaxNumberOfMessages: 10
            });;
            return await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 1');
        }
    }

    /** @InProcessingQueue */
    async pubMsgIntoInProcessingQueue(client: SQSClient, key: string): Promise<SendMessageCommandOutput> {
        try {
            const command = new SendMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('IN_PROCESSING')),
                MessageBody: key
            });
            return await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 2');
        }
    }

    /** @InProcessingQueue */
    async delMsgInProcessingQueue(client: SQSClient, message: Message): Promise<void> {
        try {
            const command = new DeleteMessageCommand({
                QueueUrl: this.configService.get(this.getQueueURL('IN_PROCESSING')),
                ReceiptHandle: message.ReceiptHandle
            })
            await client.send(command);
        } catch (err) {
            throw new WorkerException(err?.message, 'ERROR 7');
        }
    }

    async getPrototype() {

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
        const { Messages } = await client.send(command);
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



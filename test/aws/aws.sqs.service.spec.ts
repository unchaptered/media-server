import { AwsSqsService } from "@aws/aws.sqs.service";
import { ConfigService } from "@nestjs/config";

describe('[UNIT] Aws Sqs Service', () => {

    let sutAwsSqsService: AwsSqsService;
    let mockConfigService: ConfigService;


    beforeEach(() => {
        mockConfigService = new ConfigService();
        sutAwsSqsService = new AwsSqsService(mockConfigService);
    });

    describe('[REF]', () => {
        it('awsSqsService must be defined', () => expect(sutAwsSqsService).toBeDefined());
        it('awsSqsService must be instanceof AwsSqsService', () => expect(sutAwsSqsService).toBeInstanceOf(AwsSqsService));

        it('AwsSqsService.prototype.getSQSClient', () => expect(sutAwsSqsService.getSQSClient).toBeDefined());
        it('AwsSqsService.prototype.subMsgInReadyQueue', () => expect(sutAwsSqsService.subMsgInReadyQueue).toBeDefined());
        it('AwsSqsService.prototype.pubMsgInReadyQueue', () => expect(sutAwsSqsService.pubMsgInReadyQueue).toBeDefined());
        it('AwsSqsService.prototype.delMsgInReadyQueue', () => expect(sutAwsSqsService.delMsgInReadyQueue).toBeDefined());
        it('AwsSqsService.prototype.subMsgInInProcessingQueue', () => expect(sutAwsSqsService.subMsgInInProcessingQueue).toBeDefined());
        it('AwsSqsService.prototype.subBulkMsgInInProcessingQueue', () => expect(sutAwsSqsService.subBulkMsgInInProcessingQueue).toBeDefined());
        it('AwsSqsService.prototype.pubMsgIntoInProcessingQueue', () => expect(sutAwsSqsService.pubMsgIntoInProcessingQueue).toBeDefined());
        it('AwsSqsService.prototype.delMsgInProcessingQueue', () => expect(sutAwsSqsService.delMsgInProcessingQueue).toBeDefined());
        it('AwsSqsService.prototype.getPrototype', () => expect(sutAwsSqsService.getPrototype).toBeDefined());
    });

});
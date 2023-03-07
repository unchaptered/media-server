import { AwsS3Service } from "@aws/aws.s3.service";
import { ConfigService } from "@nestjs/config";


describe('[UNIT] Aws S3 Service', () => {

    let sutAwsS3Service: AwsS3Service;
    let configService: ConfigService;

    beforeEach(() => {
        configService = new ConfigService();
        sutAwsS3Service = new AwsS3Service(configService);
    });

    describe('[REF]', () => {
        it('sutAwsS3Service must be defined', () => expect(sutAwsS3Service).toBeDefined());
        it('sutAwsS3Service must be instanceof AwsS3Service', () => expect(sutAwsS3Service).toBeInstanceOf(AwsS3Service));

        it('AwsS3Service.prototype.isExistsFile must be defined', () => expect(sutAwsS3Service.isExistsFile).toBeDefined());
        it('AwsS3Service.prototype.downloadFile must be defined', () => expect(sutAwsS3Service.downloadFile).toBeDefined());
        it('AwsS3Service.prototype.uploadFile must be defined', () => expect(sutAwsS3Service.uploadFile).toBeDefined());
        it('AwsS3Service.prototype.getPresignedUrl must be defined', () => expect(sutAwsS3Service.getPresignedUrl).toBeDefined());
    });

    describe('[CORE]', () => {

        const bucketName = 'sample';
        const regionName = 'region';
        const accessKey = 'sample-access-key';
        const secretKey = 'sample-secret-key';

        beforeEach(() => {

            // MOCKING
            configService.get = jest.fn(
                (param: string): string => {
                    if (param === 'AWS_S3_BUCKET_NAME') return bucketName;
                    if (param === 'AWS_S3_REGION') return regionName;
                    if (param === 'AWS_S3_ACCESS_KEY') return accessKey;
                    if (param === 'AWS_S3_SECRET_KEY') return secretKey;
                }
            )
        });

        it('AwsS3Service.prototype.getPresignedUrl should return url', async () => {

            const key = 'hello.mp4';
            const preSignedUrl = await sutAwsS3Service.getPresignedUrl(key);

            expect(preSignedUrl).toMatch(`https://${bucketName}.s3.${regionName}.amazonaws.com/origin_${key}`);

            expect(preSignedUrl).toMatch('X-Amz-Algorithm=AWS4-HMAC-SHA256');
            expect(preSignedUrl).toMatch('X-Amz-Content-Sha256=UNSIGNED-PAYLOAD');
            expect(preSignedUrl).toMatch('X-Amz-Credential=sample-access-key');
            expect(preSignedUrl).toMatch('X-Amz-Date=');
            expect(preSignedUrl).toMatch('X-Amz-Expires=');
            expect(preSignedUrl).toMatch('X-Amz-Signature=');

        });

        afterEach(() => jest.clearAllMocks());
    });

});
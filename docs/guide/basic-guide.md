[< 뒤로 가기](../../README.md)

## Basic Guide

AWS Console을 활용해서 이 프로젝트를 셋팅합니다.

총 4단계로 구성되어 있으며, 전반적인 가이드가 포함되어 있습니다.

<br>

### 1. IAM 생성하기 가이드

AwsS3FullAccess, AwsSQSFullAccess 권한을 가지고 있는 IAM을 생성해주세요.

해당 IAM의 AccessKeyId, SecretAccessKey를 발급받고 기록해두세요.

**기록한 IAM은 절대로 인터넷 환경에 업로드하면 안됩니다.**

- 자세한 내용은 [AWS SDK 사용을 위한 IAM 가이드](https://unchaptered.notion.site/AWS-SDK-IAM-0ba94cf3c58f48a79eabe1bb878f49c5)를 참고해주세요.

<br>

### 2. S3, SQS 생성 및 연결하기 가이드

기본 설정을 그대로 유지한 S3를 생성해주세요.

SQS를 만들고 S3에서 SQS에 이벤트를 발생시킬 수 있게 AccessPolicy를 설정해주세요.

S3에서 **s3:ObjectCreated:** 이벤트가 있을 때, SQS로 이벤트 알림이 발생하게 만들어주세요.

- 자세한 내용은 [S3 + SQS를 이용한 이벤트 생성 가이드](https://unchaptered.notion.site/S3-SQS-f207c3dd737743bea25c41a473b376bc)를 참고해주세요.

<br>

### 3. 환경변수 파일(.env) 생성하기 가이드

프로젝트 루트 경로에 '.env' 파일을 생성해주세요.

아래에서 명시한 정보는 사전 단계 1, 2를 통해 얻을 수 있습니다.

```default
PORT = 3000

AWS_S3_REGION = S3 리전 명
AWS_S3_ACCESS_KEY = S3FullAccess 권한을 가진 IAM 공개키
AWS_S3_SECRET_KEY = S3FullAccess 권한을 가진 IAM 비밀키
AWS_S3_BUCKET_NAME = S3 버킷 명

AWS_SQS_REGION = SQS 리전 명
AWS_SQS_ACCESS_KEY = SQSFullAccess 권한을 가진 IAM 공개키
AWS_SQS_SECRET_KEY = SQSFullAccess 권한을 가진 IAM 비밀키
AWS_SQS_READY_QUEUE_URL = S3와 연동된 SQS URL
AWS_SQS_IN_PROCESSING_QUEUE_URL = S3와 연동되지 않은 SQS URL
```

<br>

### 4. FFmpeg 설치하기 가이드

FFmpeg은 비디오, 오디오 및 멀티미디어 파일을 처리하기 위한 무료 오픈소스 프로그램입니다.

배포자, 사용자에 따라서 다양한 형태의 Ffmpeg를 사용하고 있습니다.

따라서 이 프로젝트와 버전이 달라서 Ffmpeg 커맨드가 작동하지 않을 경우, [src/ffmpeg/ffmpeg.service.ts](../../src/ffmpeg/ffmpeg.service.ts) 파일의 getToH264Command 메서드에 담긴 Ffmpeg 커맨드를 수정해주세요. FFmpeg 커맨드를 모른다면, 본인이 설치한 FFmpeg 버전과 함꼐 ChatGPT에 다음의 질문을 통해서 적합한 커맨드를 얻을 수 있을 것입니다.

```
How can I convert H265 Video to H264 Video using FFmpeg in Windows 11?
```

프로젝트 작업환경인 Windows 11에 맞춰서 방법을 소개하겠습니다.

1. FFmpeg GitHub 공식 게정에서 [FFmpeg@autobuild-2023-03-04-12-47](https://github.com/BtbN/FFmpeg-Builds/releases/tag/autobuild-2023-03-04-12-47) 버전을 다운로드 합니다.
2. 압축 파일을 원하는 경로에 해제합니다. 단, 원하는 전체 경로에는 한글이 포함되지 않아야 합니다.
3. 압축 해제된 파일의 ~/bin 폴더를 [고급 시스템 설정]-[환경 변수]에 등록해주세요.
4. VSC, cmd를 다시 시작한 후 `ffmpeg --version`으로 설치를 확인해주세요.

- 이론적인 내용은 [Ffmpeg에 대하여](https://unchaptered.notion.site/FFmpeg-2bfbbbe3ca6840ee9cccf441ddd0b5f1)를 참고해주세요.
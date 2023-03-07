[< 뒤로 가기](../../README.md)


## Terraform Gudie

Terraform을 활용해서 이 프로젝트를 셋팅합니다.

총 7단계로 구성되어 있으며, 전반적인 가이드가 포함되어 있습니다.

<br>

### 1. Terraform 설치하기

Terraform은 코드형 인프라 생성, 수정, 제거 툴입니다.

[Terraform Installation 공식 사이트](https://developer.hashicorp.com/terraform/downloads)를 방문하셔서, 작성일 기준 버전인 terraform@1.3.9를 설치해주세요.

버전이 다를 경우 terraform config 문법이 다르기 때문에 꼭 버전을 맞춰주세요.

본인의 CPU가 AMD가 아닐 경우, 386버전을 설치하면 됩니다.

<image src="../terraform-installation.png" style="width: 800px;">

- 더 자세한 이론적인 내용은 [Terraform에 대한 이해](https://unchaptered.notion.site/Terraform-5d41afa76d804027ac2d7c36d6602e51)를 참고해주세요.

<br>

### 2. AWS CLI2 설치하기

AWS CLI2는 AWS Resource들을 제어할 수 있는 툴입니다.

[AWS CLI2 공식 문서](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)를 참고하셔서, 사용자 환경에 맞는 CLI2 를 설치해주세요.

<br>

### 3. IAM 발급 받기

AWS CLI2에 등록할 `IAM`을 발급받아주세요.

이후 Terraform을 통해서 S3를 만들려고하면 `위 IAM`에 AwsS3FullAccess를 부여하면 됩니다.

```cmd
aws configure
```

위 명령어를 입력하면, 다음과 같은 명령어를 순차적으로 채워넣으면 됩니다.

```cmd
AWS Access Key ID [None]: 엑세스 KEY
AWS Secret Access Key [None]: 시크릿 엑세스 KEY
Default region name [None]: ap-northeast-2
Default output format [None]: json
```

<br>

### 4. Terraform Config을 위한 Variables파일 만들기

프로젝트 루트 경로에 `terraform.tf`라는 파일을 하나 만들어주세요.

반드시 이름이 `terraform.tf`여야 합니다.

```cmd
variable "region" {
  type    = string
  default = "리전 이름"
}

variable "s3_bucket_name" {
  type    = string
  default = "버킷 이름"
}

variable "main_sqs_queue_name" {
  type    = string
  default = "Ready 큐 이름"
}

variable "sub_sqs_queue_name" {
  type    = string
  default = "InProcessing 큐 이름"
}

variable "iam_user_name" {
  type    = string
  default = "IAM 유저 이름"
}
```

<br>

### 5. Terraform Config으로 인프라 배포하기

terraform apply를 통해서 배포를 해주세요.

```cmd
terraform apply
```

위 명령어는 terraform workflow 중 한 단계입니다.

각 단게별 스크립트와 설명은 다음과 같습니다.

| STEP | DESCRIPTION |
| --- | --- |
| terraform init | - terraform config 파일을 만들면서 작업용 폴더를 초기화 합니다. |
| terraform validate | - terraform config 파일에 문법적인 오류가 없는지 확인합니다. |
| terraform plan | - terraform 코드에서 변경사항을 분석하고, 실행될 변경사항을 표시하는 실행 계획을 생성합니다. 이를 통해서 사용자가 실제 변경사항을 미리 볼 수 있습니다.
- 엔지니어의 실수를 방지하는 중요한 단계입니다. |
| terraform apply | - terraform 코드를 사용해서 변경사항을 실행해서 Infrasturcture를 생성,수정,삭제 하는 기능을 제공합니다. |
| terraform destroy | - terraform 코드를 사용해서 생성한 Infrastructure 전체를 삭제합니다. |

- 만약 에러가 뜨면 [Terraform 디버깅 옵션 제어](https://unchaptered.notion.site/Terraform-Windows-11-475fd32a35394a5a9f72abf6b10d2d1c)를 참고해서, 에러 메세지를 자세히 볼 수 있는 옵션을 활성화시켜주세요.

<br>

### 6. Terraform output을 활용한 환경변수 생성 스크립트 가동

사전 작업단계 1~5를 따라했다면, `terraform output` 명령어를 통해서 변수들을 확인할 수 있습니다.

<image src="../terraform-output.png" style="widht: 600px;"/>

인프라 구성 변수들은 보안상 민감한 정보이기 때문에 `sensitive = true` 옵션이 필수 적용됩니다.

다라서 `terraform output [원하는 변수명]`을 통해서 일일히 호출해야 합니다.

위 커멘드를 이용해서 `env.sh`에서는 .env 파일을 자동으로 생성하고 있습니다.

Mac, Linux 계열에서는 바로 `sh env.sh`를 사용할 수 있습니다.

Windows 계열에서는 WSL, Git Bash를 통해 `sh env.sh`를 사용할 수 있습니다.

- WSL이 설치 되어 있지 않다면, Git Bash를 권고합니다.

<br>

### 47. FFmpeg 설치하기 가이드

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
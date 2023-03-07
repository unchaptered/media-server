#!/bin/bash

# terraform output aws_region은 "\"ap-northeast-2\"" 등을 리턴합니다.
# 따라서 | sed 's/\"//g' 구문을 통해서 "ap-northeast-2" 로 변환해야합니다.

PORT=$1

if [ -z "$PORT" ]; then
    echo "Error : When you call .env.sh, must contain PORT NUMBER"
    echo "Such as : sh env.sh 3000"
    exit 1
fi

AWS_S3_REGION=$(terraform output aws_region | sed 's/\"//g')
AWS_S3_ACCESS_KEY=$(terraform output aws_iam_access_key | sed 's/\"//g')
AWS_S3_SECRET_KEY=$(terraform output aws_iam_secret_key | sed 's/\"//g')
AWS_S3_BUCKET_NAME=$(terraform output aws_s3_bucket_name | sed 's/\"//g')

AWS_SQS_REGION=$(terraform output aws_region | sed 's/\"//g')
AWS_SQS_ACCESS_KEY=$(terraform output aws_iam_access_key | sed 's/\"//g')
AWS_SQS_SECRET_KEY=$(terraform output aws_iam_secret_key | sed 's/\"//g')
AWS_SQS_READY_QUEUE_URL=$(terraform output aws_sqs_ready_queue_url | sed 's/\"//g')
AWS_SQS_IN_PROCESSING_QUEUE_URL=$(terraform output aws_sqs_in_processing_queue_url | sed 's/\"//g')

rm -f ./.env

touch ./.env

echo "PORT = $PORT" >> .env
echo "AWS_S3_REGION = $AWS_S3_REGION" >> .env
echo "AWS_S3_ACCESS_KEY = $AWS_S3_ACCESS_KEY" >> .env
echo "AWS_S3_SECRET_KEY = $AWS_S3_SECRET_KEY" >> .env
echo "AWS_S3_BUCKET_NAME = $AWS_S3_BUCKET_NAME" >> .env
echo " " >> .env

echo "AWS_SQS_REGION = $AWS_SQS_REGION" >> .env
echo "AWS_SQS_ACCESS_KEY = $AWS_SQS_ACCESS_KEY" >> .env
echo "AWS_SQS_SECRET_KEY = $AWS_SQS_SECRET_KEY" >> .env
echo "AWS_SQS_READY_QUEUE_URL = $AWS_SQS_READY_QUEUE_URL" >> .env
echo "AWS_SQS_IN_PROCESSING_QUEUE_URL = $AWS_SQS_IN_PROCESSING_QUEUE_URL" >> .env
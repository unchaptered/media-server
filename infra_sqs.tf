resource "aws_sqs_queue" "video_bucket_main_sqs" {

    name = var.main_sqs_queue_name

}

resource "aws_sqs_queue_policy" "namvideo_bucket_main_sqs_policy" {
    queue_url = aws_sqs_queue.video_bucket_main_sqs.id

    policy = jsonencode({
        Version = "2012-10-17",
        Statement: [
            {
            Sid = "Allow S3 to send messages to the queue",
            Effect = "Allow",
            Principal = {
                Service = "s3.amazonaws.com"
            },
            Action = "SQS:SendMessage",
            Resource = aws_sqs_queue.video_bucket_main_sqs.arn,
            Condition = {
                "ArnEquals" = {
                    "aws:SourceArn" = aws_s3_bucket.video_bucket.arn
                }
            }
            }
        ]
    })

}

resource "aws_sqs_queue" "video_bucket_sub_sqs" {

    name = var.sub_sqs_queue_name

}


# output

output "aws_sqs_ready_queue_url" {
  value         =   aws_sqs_queue.video_bucket_main_sqs.url
  sensitive     =   true
}

output "aws_sqs_in_processing_queue_url" {
  value         =   aws_sqs_queue.video_bucket_sub_sqs.url
  sensitive     =   true
}
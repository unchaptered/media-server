resource "aws_s3_bucket" "video_bucket" {

    bucket = var.s3_bucket_name

}

resource "aws_s3_bucket_notification" "video_bucket_put_notification" {

    bucket = aws_s3_bucket.video_bucket.id

    queue {
        
        queue_arn   = aws_sqs_queue.video_bucket_main_sqs.arn
        events      = ["s3:ObjectCreated:*"]

    }

}


# output

output "aws_s3_bucket_name" {
  value         =   aws_s3_bucket.video_bucket.bucket
  sensitive     =   true
}

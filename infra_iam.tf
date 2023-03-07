resource "aws_iam_user" "s3_sqs_user" {
  name          =   var.iam_user_name
}

resource "aws_iam_user_policy_attachment" "s3_policy_attachment" {
  user          =   aws_iam_user.s3_sqs_user.name
  policy_arn    =   "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_user_policy_attachment" "sqs_policy_attachment" {
  user          =   aws_iam_user.s3_sqs_user.name
  policy_arn    =   "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
}

resource "aws_iam_access_key" "s3_sqs_user_access_key" {
  user          =   aws_iam_user.s3_sqs_user.name
}


# output

output "aws_iam_access_key" {
  value         =   aws_iam_access_key.s3_sqs_user_access_key.id
  sensitive     =   true
}

output "aws_iam_secret_key" {
  value         =   aws_iam_access_key.s3_sqs_user_access_key.secret
  sensitive     =   true
}
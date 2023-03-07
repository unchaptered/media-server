provider "aws" {

    region = var.region

}


# output

output "aws_region" {
  value         =   var.region
  sensitive     =   true
}
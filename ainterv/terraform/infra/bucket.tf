resource "aws_s3_bucket" "my_bucket" {
  bucket = "${var.env}-cloud-infra-app-bucket"
  tags = {
    Name = "${var.env}-cloud-infra-app-bucket"
    Environment = var.env
  }
}
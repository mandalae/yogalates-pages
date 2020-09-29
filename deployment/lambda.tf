provider "aws" {
  region = "eu-west-1"
}

resource "aws_lambda_permission" "Yogalates-getPages" {
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.Yogalates-getPages.function_name}"
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_function" "Yogalates-getPages" {
  filename      = "../artifact/artifact.zip"
  function_name = "Yogalates-getPages"
  role          = "arn:aws:iam::368263227121:role/BasicLambdaRole"
  handler       = "index.handler"
  source_code_hash = "${filebase64sha256("../artifact/artifact.zip")}"
  runtime       = "nodejs12.x"

}

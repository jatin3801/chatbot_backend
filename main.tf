# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

provider "aws" {
  region = local.aws_region

  default_tags {
    tags = {
      ai_chatbot = "lambda-ai_chatbot",
      env = terraform.workspace
    }
  }
}

terraform {
  backend "s3" {
    bucket = "ai-chatbot-terraform-tfstate"
    key    = "terraform.tfstate"
    region = "ap-south-1"
  }
}

# S3

resource "random_pet" "lambda_bucket_name" {
  prefix = "ai-chatbot-${local.environment}"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

# LAMBDA ZIP

data "archive_file" "lambda_zip" {
  for_each = local.functions
  
  type = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/${each.key}.zip"
}

resource "aws_s3_object" "lambda_zip" {
  for_each = local.functions

  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "${each.key}.zip"
  source = data.archive_file.lambda_zip[each.key].output_path
  etag   = filemd5(data.archive_file.lambda_zip[each.key].output_path)
}

# LAMBDA

resource "aws_lambda_function" "function" {
  for_each = local.functions
  
  function_name = "${each.value.function_name}${title(local.environment)}"
  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_zip[each.key].key
  runtime = each.value.runtime
  handler = each.value.handler
  timeout = each.value.timeout

  environment {
    variables = {
      DB_DATABASE = data.aws_ssm_parameter.db_database.value
      DB_HOST = data.aws_ssm_parameter.db_host.value
      DB_PORT = data.aws_ssm_parameter.db_port.value
      DB_USERNAME = data.aws_ssm_parameter.db_username.value
      DB_PASSWORD = data.aws_ssm_parameter.db_password.value

      JWT_SECRET = data.aws_ssm_parameter.jwt_secret.value
      
      AZURE_INSTANCE_NAME = data.aws_ssm_parameter.azure_instance_name.value
      AZURE_API_ENDPOINT = data.aws_ssm_parameter.azure_api_endpoint.value
      AZURE_API_KEY = data.aws_ssm_parameter.azure_api_key.value
      AZURE_API_VERSION = "2024-02-01"
      AZURE_API_DEPLOYMENT = "gpt-4o"
      AZURE_API_EMBEDDINGS = "text-embedding-3-large"
    }
  }

  source_code_hash = data.archive_file.lambda_zip[each.key].output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

# SSM

data "aws_ssm_parameter" "db_database" {
  name  = "/ai_chatbot/${local.environment}/db_database"
}

data "aws_ssm_parameter" "db_host" {
  name  = "/ai_chatbot/db_host"
}

data "aws_ssm_parameter" "db_port" {
  name  = "/ai_chatbot/db_port"
}

data "aws_ssm_parameter" "db_username" {
  name  = "/ai_chatbot/db_username"
}

data "aws_ssm_parameter" "db_password" {
  name  = "/ai_chatbot/db_password"
  with_decryption = true
}

data "aws_ssm_parameter" "jwt_secret" {
  name  = "/ai_chatbot/jwt_secret"
  with_decryption = true
}

data "aws_ssm_parameter" "azure_api_key" {
  name  = "/ai_chatbot/azure_api_key"
  with_decryption = true
}

data "aws_ssm_parameter" "azure_api_endpoint" {
  name  = "/ai_chatbot/azure_api_endpoint"
  with_decryption = true
}

data "aws_ssm_parameter" "azure_instance_name" {
  name  = "/ai_chatbot/azure_instance_name"
}

resource "aws_cloudwatch_log_group" "function" {
  for_each = local.functions
  
  name = "/aws/lambda/${aws_lambda_function.function[each.key].function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda_${local.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_ssm_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

# API GATEWAY

resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw_${local.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "serverless_lambda_stage_${local.environment}"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = local.functions
  
  api_id = aws_apigatewayv2_api.lambda.id
  integration_uri    = aws_lambda_function.function[each.key].invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "lambda_route" {
  for_each = local.functions
  
  api_id = aws_apigatewayv2_api.lambda.id
  route_key = "${each.value.http_method} /${each.key}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  for_each = local.functions
  
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

locals {
  environment = terraform.workspace
  aws_region  = "ap-south-1"

  functions = {
    chatbot = {
      function_name = "Chatbot"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 120
      http_method   = "POST"
      source_dir    = "${path.module}/functions/chatbot"
    },
    suggestions = {
      function_name = "Suggestions"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "GET"
      source_dir    = "${path.module}/functions/question-suggestion"
    },
    activity = {
      function_name = "Activity"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "GET"
      source_dir    = "${path.module}/functions/bot-activity"
    }
    login = {
      function_name = "Login"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "POST"
      source_dir    = "${path.module}/functions/auth-login"
    }
    user-details = {
      function_name = "User-Details"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "GET"
      source_dir    = "${path.module}/functions/get-user-details"
    }
    post-settings = {
      function_name = "Post-Settings"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "POST"
      source_dir    = "${path.module}/functions/post-settings"
    }
    settings = {
      function_name = "Settings"
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      timeout       = 60
      http_method   = "GET"
      source_dir    = "${path.module}/functions/get-settings"
    }
  }
}

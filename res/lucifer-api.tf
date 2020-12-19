resource "heroku_app" "lucifer-api" {
  name   = "lucifer-api"
  region = "eu"

  buildpacks = [
    "heroku/nodejs"
  ]

  config_vars = {
    YARN_PRODUCTION = "true"

    AUTH0_DOMAIN    = "dev-lucifer.eu.auth0.com"
    AUTH0_AUDIENCE  = "https://lucifer-api.herokuapp.com/"
    AUTH0_CLIENT_ID = "ktmzvUo29TuSbQ8p1AvLrZMPTYCPsH3Z"
  }

  sensitive_config_vars = {
    AUTH0_CLIENT_SECRET = var.auth0-client-secret
  }
}

resource "heroku_addon" "lucifer-api" {
  app  = heroku_app.lucifer-api.name
  plan = "heroku-postgresql:hobby-dev"
}

output "lucifer-api-git-url" {
  value = heroku_app.lucifer-api.git_url
}

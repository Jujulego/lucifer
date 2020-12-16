resource "heroku_app" "lucifer-api" {
  name   = "lucifer-api"
  region = "eu"

  config_vars = {
    CI              = "true"
    YARN_PRODUCTION = "true"
  }

  buildpacks = [
    "heroku/nodejs"
  ]
}

resource "heroku_addon" "lucifer-api" {
  app  = heroku_app.lucifer-api.name
  plan = "heroku-postgresql:hobby-dev"
}

output "lucifer-api-git-url" {
  value = heroku_app.lucifer-api.git_url
}

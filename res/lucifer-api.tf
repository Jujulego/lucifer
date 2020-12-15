resource "heroku_app" "lucifer-api" {
  name   = "lucifer-api"
  region = "eu"

  config_vars = {
    YARN_PRODUCTION = "true"
  }

  buildpacks = [
    "heroku/nodejs"
  ]
}

output "lucifer-api-git-url" {
  value = heroku_app.lucifer-api.git_url
}

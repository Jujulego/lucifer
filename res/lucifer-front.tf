resource "heroku_app" "lucifer-front" {
  name   = "lucifer-front"
  region = "eu"

  buildpacks = [
    "heroku/nodejs"
  ]

  config_vars = {
    YARN_PRODUCTION       = "true"
    NPM_CONFIG_PRODUCTION = "true"
  }
}

output "lucifer-front-git-url" {
  value = heroku_app.lucifer-front.git_url
}

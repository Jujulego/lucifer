resource "auth0_client" "lucifer-front" {
  name                = "Lucifer"
  app_type            = "spa"
  callbacks           = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  allowed_logout_urls = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  allowed_origins     = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
}

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

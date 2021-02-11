# Auth0 resources
resource "auth0_client" "lucifer-front" {
  name                = "Lucifer"
  app_type            = "spa"
  grant_types         = ["implicit", "authorization_code", "refresh_token"]
  oidc_conformant     = true
  callbacks           = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  allowed_logout_urls = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  web_origins         = ["http://localhost:4200", heroku_app.lucifer-front.web_url]

  jwt_configuration {
    alg = "RS256"
  }
}

# Heroku resources
resource "heroku_app" "lucifer-front" {
  name   = "lucifer-front"
  region = "eu"

  buildpacks = [
    "https://github.com/heroku/heroku-buildpack-multi-procfile.git",
    "heroku/nodejs"
  ]

  config_vars = {
    # Multi-Procfile
    PROCFILE = "apps/lucifer-api/Procfile"

    # NodeJS
    YARN_PRODUCTION       = "true"
    NPM_CONFIG_PRODUCTION = "true"
  }
}

resource "auth0_client" "lucifer-front" {
  name                = "Lucifer"
  app_type            = "spa"
  callbacks           = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  allowed_logout_urls = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
  allowed_origins     = ["http://localhost:4200", heroku_app.lucifer-front.web_url]
}

resource "auth0_client_grant" "lucifer-front--lucifer-api" {
  audience  = auth0_resource_server.lucifer-api.identifier
  client_id = auth0_client.lucifer-front.client_id
  scope     = []
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

output "lucifer-front-git-url" {
  value = heroku_app.lucifer-front.git_url
}

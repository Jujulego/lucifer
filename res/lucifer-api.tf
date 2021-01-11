resource "auth0_client" "lucifer-api" {
  name     = "Lucifer API"
  app_type = "non_interactive"
}

resource "auth0_resource_server" "lucifer-api" {
  name             = "Lucifer API"
  identifier       = "https://lucifer-api.herokuapp.com/"
  signing_alg      = "RS256"
  enforce_policies = true
  token_dialect    = "access_token_authz"

  scopes {
    value = "read:users"
  }

  scopes {
    value = "update:users"
  }

  scopes {
    value = "create:projects"
  }

  scopes {
    value = "read:projects"
  }

  scopes {
    value = "update:projects"
  }

  scopes {
    value = "delete:projects"
  }
}

resource "heroku_app" "lucifer-api" {
  name   = "lucifer-api"
  region = "eu"

  buildpacks = [
    "heroku/nodejs"
  ]

  config_vars = {
    YARN_PRODUCTION       = "true"
    NPM_CONFIG_PRODUCTION = "true"

    AUTH0_DOMAIN    = var.auth0-domain
    AUTH0_AUDIENCE  = auth0_resource_server.lucifer-api.identifier
    AUTH0_CLIENT_ID = auth0_client.lucifer-api.client_id
  }

  sensitive_config_vars = {
    AUTH0_CLIENT_SECRET = auth0_client.lucifer-api.client_secret
  }
}

resource "heroku_addon" "lucifer-api" {
  app  = heroku_app.lucifer-api.name
  plan = "heroku-postgresql:hobby-dev"
}

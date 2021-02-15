# Auth0 resources
resource "auth0_client" "lucifer-api" {
  name        = "Lucifer API"
  app_type    = "non_interactive"
  grant_types = ["client_credentials"]
}

resource "auth0_client_grant" "lucifer-api--management-api" {
  audience  = "https://${var.auth0-domain}/api/v2/"
  client_id = auth0_client.lucifer-api.client_id
  scope     = ["read:users", "update:users", "read:roles", "create:role_members", "read:role_members", "delete:role_members"]
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
    value = "read:roles"
  }

  scopes {
    value = "update:roles"
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

  scopes {
    value = "create:variables"
  }

  scopes {
    value = "read:variables"
  }

  scopes {
    value = "update:variables"
  }

  scopes {
    value = "delete:variables"
  }
}

# Heroku resources
# - production app
resource "heroku_app" "lucifer-api" {
  name   = "lucifer-api"
  region = "eu"
  stack  = "heroku-20"

  buildpacks = [
    "heroku-community/multi-procfile",
    "heroku/nodejs"
  ]

  config_vars = {
    # Multi-Procfile
    PROCFILE = "apps/lucifer-api/Procfile"

    # NodeJS
    NX_APP = "lucifer-api"

    # App config
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

# - pipeline
resource "heroku_pipeline" "lucifer-api" {
  name = "lucifer-api"

  owner {
    id   = var.heroku-owner
    type = "user"
  }
}

resource "heroku_pipeline_config_var" "lucifer-api-config" {
  pipeline_id    = heroku_pipeline.lucifer-api.id
  pipeline_stage = "review"

  vars = {
    # Multi-Procfile
    PROCFILE = "apps/lucifer-api/Procfile"

    # NodeJS
    NX_APP = "lucifer-api"

    # App config
    AUTH0_DOMAIN    = var.auth0-domain
    AUTH0_AUDIENCE  = auth0_resource_server.lucifer-api.identifier
    AUTH0_CLIENT_ID = auth0_client.lucifer-api.client_id
  }

  sensitive_vars = {
    AUTH0_CLIENT_SECRET = auth0_client.lucifer-api.client_secret
  }
}

resource "heroku_pipeline_coupling" "lucifer-api-production" {
  app      = heroku_app.lucifer-api.name
  pipeline = heroku_pipeline.lucifer-api.id
  stage    = "production"
}

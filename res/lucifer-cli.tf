# Auth0 resources
resource "auth0_client" "lucifer-cli" {
  name            = "Lucifer CLI"
  app_type        = "native"
  grant_types     = ["urn:ietf:params:oauth:grant-type:device_code", "refresh_token"]
  oidc_conformant = true

  jwt_configuration {
    alg = "RS256"
  }
}

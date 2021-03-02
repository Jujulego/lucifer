# Auth0 resources
resource "auth0_client" "lucifer-cli" {
  name                       = "Lucifer CLI"
  app_type                   = "native"
  grant_types                = ["client_credentials"]
  oidc_conformant            = true
  token_endpoint_auth_method = "none"

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client" "lucifer-e2e" {
  name                = "Lucifer E2E"
  app_type            = "spa"
  grant_types         = ["password"]
  callbacks           = ["http://localhost:4200"]
  allowed_logout_urls = ["http://localhost:4200"]
  web_origins         = ["http://localhost:4200"]
}

resource "auth0_user" "e2e" {
  connection_name = "Username-Password-Authentication"
  email           = "e2e@test.com"
  password        = "e2e-cypress"
}

resource "github_actions_secret" "e2e-auth0-client-secret" {
  repository = var.github-repository
  secret_name = "E2E_AUTH0_CLIENT_SECRET"
  plaintext_value = auth0_client.lucifer-e2e.client_secret
}

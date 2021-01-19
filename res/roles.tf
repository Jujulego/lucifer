resource "auth0_role" "admin" {
  name = "admin"

  dynamic "permissions" {
    for_each = auth0_resource_server.lucifer-api.scopes

    content {
      name                       = permissions.value.value
      resource_server_identifier = auth0_resource_server.lucifer-api.identifier
    }
  }
}

resource "auth0_role" "reader" {
  name = "reader"

  permissions {
    name                       = "read:users"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "read:roles"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "read:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }
}

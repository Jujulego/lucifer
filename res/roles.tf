resource "auth0_role" "admin" {
  name = "admin"

  permissions {
    name                       = "read:users"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "update:users"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "create:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "read:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "update:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "delete:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }
}

resource "auth0_role" "reader" {
  name = "reader"

  permissions {
    name                       = "read:users"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }

  permissions {
    name                       = "read:projects"
    resource_server_identifier = auth0_resource_server.lucifer-api.identifier
  }
}

resource "auth0_tenant" "tenant" {
  default_directory = "Username-Password-Authentication"
}

// Rules
locals {
  rules-directory = "${path.root}/auth0-rules"
}

data "local_file" "add-permissions" {
  filename = "${local.rules-directory}/add-permissions.js"
}

resource "auth0_rule" "add-permissions" {
  name   = "Add Permissions"
  script = data.local_file.add-permissions.content
}

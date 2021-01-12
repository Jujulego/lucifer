resource "auth0_tenant" "tenant" {
  default_directory = "Username-Password-Authentication"
}

// Rules
locals {
  rules-directory = "${path.root}/auth0-rules"
}

resource "auth0_rule" "rule" {
  for_each = fileset(path.root, "auth0-rules/*.js")

  name   = title(replace(trimsuffix(basename(each.value), ".js"), "-", " "))
  script = file(each.value)
}

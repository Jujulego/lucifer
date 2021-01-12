resource "auth0_tenant" "tenant" {
  default_directory = "Username-Password-Authentication"
}

// Rules
resource "auth0_rule" "rule" {
  for_each = fileset(path.root, "rules/*.js")

  name   = title(replace(trimsuffix(basename(each.value), ".js"), "-", " "))
  script = file(each.value)
}

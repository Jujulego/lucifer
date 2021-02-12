variable "heroku-owner" {
  type      = string
  sensitive = true
}

variable "auth0-domain" {
  type      = string
  sensitive = false
  default   = "jujulego.eu.auth0.com"
}

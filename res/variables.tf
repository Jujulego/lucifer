variable "auth0-domain" {
  type      = string
  sensitive = false
  default   = "jujulego.eu.auth0.com"
}

variable "github-repository" {
  type    = string
  default = "lucifer"
}

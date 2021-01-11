terraform {
  backend "remote" {
    organization = "jujulego"

    workspaces {
      name = "lucifer"
    }
  }

  required_providers {
    auth0 = {
      source = "alexkappa/auth0"
    }
    heroku = {
      source = "heroku/heroku"
    }
  }
}

provider "auth0" {
  domain = var.auth0-domain
}

provider "heroku" {
}

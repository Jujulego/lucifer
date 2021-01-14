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
    github = {
      source = "integrations/github"
    }
  }
}

provider "auth0" {
  domain = var.auth0-domain
}

provider "heroku" {
}

provider "github" {
}

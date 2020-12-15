terraform {
  backend "remote" {
    organization = "jujulego"

    workspaces {
      name = "lucifer"
    }
  }

  required_providers {
    heroku = {
      source = "heroku/heroku"
    }
  }
}

provider "heroku" {
}

terraform {
  backend "pg" {}

  required_providers {
    heroku = {
      source = "heroku/heroku"
    }
  }
}

provider "heroku" {}

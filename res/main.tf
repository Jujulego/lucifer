terraform {
  backend "pg" {
  }
}

provider "heroku" {
  version = "~> 2.5.0"
}

variable "env" {
  description = "Deploy environment"
}


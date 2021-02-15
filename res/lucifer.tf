# Heroku resources
resource "heroku_pipeline" "lucifer" {
  name = "lucifer"

  owner {
    id   = var.heroku-owner
    type = "user"
  }
}

resource "heroku_pipeline_coupling" "lucifer-api-production" {
  app      = heroku_app.lucifer-api.name
  pipeline = heroku_pipeline.lucifer.id
  stage    = "production"
}

resource "heroku_pipeline_coupling" "lucifer-front-production" {
  app      = heroku_app.lucifer-front.name
  pipeline = heroku_pipeline.lucifer.id
  stage    = "production"
}

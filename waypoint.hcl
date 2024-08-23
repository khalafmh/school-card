project = "school-card"

variable "nomad_region" {
  type = string
}

variable "nomad_datacenter" {
  type = string
}

variable "backend_url" {
  type = string
  default = "https://school-card-api.cluster.mahdi.cloud"
}

app "frontend" {
  path = "frontend"
  build {
    use "docker" {
      build_args = {
        "VITE_BACKEND_URL": var.backend_url
      }
    }
    registry {
      use "docker" {
        image = "docker-registry.cluster.mahdi.cloud/khalafmh/school-card-frontend"
        tag = workspace.name
      }
    }
  }
  deploy {
    use "nomad" {
      region = var.nomad_region
      datacenter = var.nomad_datacenter
      service_port = 8080
      resources {
        cpu = 50
        memorymb = 50
      }
      auth {
        username = yamldecode(file("${path.project}/local/secrets.yaml")).docker.username
        password = yamldecode(file("${path.project}/local/secrets.yaml")).docker.password
      }
    }
  }
}

app "backend" {
  path = "backend"
  build {
    use "docker" {}
    registry {
      use "docker" {
        image = "docker-registry.cluster.mahdi.cloud/khalafmh/school-card-backend"
        tag = workspace.name
      }
    }
  }
  deploy {
    use "nomad" {
      region = "global"
      datacenter = "hetzner-eu"
      service_port = 8080
      resources {
        cpu = 100
        memorymb = 350
      }
      auth {
        username = yamldecode(file("${path.project}/local/secrets.yaml")).docker.username
        password = yamldecode(file("${path.project}/local/secrets.yaml")).docker.password
      }
    }
  }
}
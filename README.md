# Pacifico Projektjournal 

Plattform für transparente und rechtssichere Projektkommunikation


## Quickstart for development

#### Spin up all service

Note:
  - the default default environment is NOT meant for production. In production
      only use pre-build container from the registiry.
  - the default environment is currenlty meant for local development

```bash
docker-compose --build -d 
```
During development it is best to pass the `--build`-flag to make sure everything
is fresh and cheerful.


#### Global admin commands

To make live easier there is `./admin` command available in the project root. 

 - `./admin -h` show all available sub-commands
 - `./admin log [service-name]` prints the logs of a service. defaults to the
     `ifc-hive-api`-service if no argument is provided.
- `./admin install dev` adds a commit-message-template and a commit-msg hook to
    enforce a consistent format for the commit subject line.

#### Documentation 

  - [User Documentation and product overview](http://localhost:8089) 
      (not yet online, available in the api service under `/docs`)
  - Technical documentation of services
    - [Global](./docs) installation, maintenance, recommendations etc.
    - [REST-API Documentation](http://localhost:8082/docs) OpenAPI 3 documentation
    - [Web Client](./app/client/docs)
    - [API](./app/api/docs)
    - [Register](./app/reg/docs)





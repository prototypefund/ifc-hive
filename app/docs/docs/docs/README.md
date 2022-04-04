# Technical Documentation

If you directly want to toy around you can jump to the [Quickstart](quickstart).

You can review or clone the source code from our [gitlab project](https://repo.karo.design/daniel/ifc-hive)

## Overview

The main components of the IFC HIVE platform are:

1. API Back-End (ifc-hive-server)
2. Brower based Web App (ifc-hive-client)
3. Documentation (this website)
4. Auto generated API Documentation


## Technologies and Dependencies

The following lists provides an high level overview of the most important
technologies and depenencies used in this project.

- **ifc-hive-client**
  - [vue 3.0](https://vuejs.org/) Reactive framework web app 
  - [vuetify 3](https://next.vuetifyjs.com/en/) UI Component Library for Vue 3
  - [three.js](https://threejs.org/) Javascript 3D WebGL library
  - [ifc.js](https://github.com/IFCjs) Open source IFC library  
  - [vitejs](https://vitejs.dev/) Lean fron-end tooling for Vue Apps
  - [vitest](https://vitest.dev/) front-end testing framework including Vue component testing
  - [cypress](cypress) additional browser based end-to-end testing
- **ifc-hive-server**
  - [nodejs](https://nodejs.org/en/)
  - [fastify](https://www.fastify.io/) Lean nodejs web framework with excellent performance as the basis for our API and application Layer.
    - see also the [fastify ecosystem](https://www.fastify.io/ecosystem/)
  - [tap](https://node-tap.org/) lean testing framework for unit tests
  - [superTest](https://github.com/visionmedia/supertest) API testing
  - [swagger / openAPI 3.0](https://swagger.io/docs/) openAPI 3.0 compliant API documentation
  - [ifc.js](https://github.com/IFCjs) Open source IFC library
  - [ifcOpenShell](http://ifcopenshell.org/) open source ifc toolkit and geometry engine
- **Database and Storage**
  - [neo4j](https://neo4j.com/) graph database as primary database technology.
  - [redis](https://redis.io/) in memory data store for the management of socket connections and efficient access control  
  - [elasticsearch](https://www.elastic.co/de/elastic-stack/) for full-text search and meta-data aggregations and indexing of key IFC concepts as denormalized, composed entities.
- **Tools**
  - [eslint](https://eslint.org/) Code Linting
  - [snyk.io](https://snyk.io/) Security Auditing
  - [prettier.io](https://prettier.io/) Auto formatting code
  - [nyc](https://github.com/istanbuljs/nyc) Code coverage
- **Deployment und Infrastruktur** 
  - [Gitlab and gitlab-runner](https://docs.gitlab.com/runner/) for code management and deployment to test and integration environment.
  - [Docker and docker-compose](https://www.docker.com/) for development environment and as deployment format.
  - [nginx](https://www.nginx.com/) as reverse proxy and public facade
  - [letsencrypt](https://letsencrypt.org/de/) and [certbot](https://certbot.eff.org/) as default option to handle TSL/SSL certificates.
  - [logstash](https://www.elastic.co/de/logstash/) and [kibana](https://www.elastic.co/de/kibana/) docker container logs are pushed via logstash to central logging service.


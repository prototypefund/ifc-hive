# Quickstart Guide

## Set up for development

In the development environment all services allow local editing of the source
files, while running all dependencies in the respective containers.

Note that `docker-compose` reads by default two files to run the development
environment: `docker-compose.yml` and `docker-compose.override.yml`.

```bash
# download source code
git clone git@repo.karo.design:daniel/ifc-hive.git
# cd into the directory
cd ifc-hive
# start up development enviromnet. Depending on your local set up of permissions
# you might not need to use sudo.
sudo docker-compose up -d --build
```


## Build containers for publication

In order to run all containers in production mode, e.g. for local integration
testing, you need to specify utilize the `docker-compose.prod.yml` in
conjungtion with the default `docker-compose.yml` file.

```bash
git clone git@repo.karo.design:daniel/ifc-hive.git
# cd into the directory
cd ifc-hive
# if you only want to build the container
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
# if you want to build from source and run the containers, e.g. in order to run
# an integration environment, then execute
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml -d --build
```

<div style="margin-top: 20px">&nbsp;</div>

::: tip
In the IFC-HIVE project team we have a CI/CD pipeline for integration, staging
and production. So in that context there is no need to build an online
environment of the platform yourself.
:::

## Deploy for production 

In case you want to use IFC-HIVE on your own server, the recommended
installation is the one on basis of the offical images. 

::: warning
Currently we are in the very early stages of the project and there are no Docker
images published yet. As soon as we have a version of the platform fit enough
for at least user inspection and testing, we will publish offical containers and
update this section.
:::

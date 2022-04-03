# Quickstart Guide

## Set up for development

```bash
# download source code
git clone git@repo.karo.design:daniel/ifc-hive.git
# cd into the directory
cd ifc-hive
# start up development enviromnet. Depending on your local set up of permissions
# you might not need to use sudo.
sudo docker-compose up -d --build
```

## Build for production from source

```bash
git clone git@repo.karo.design:daniel/ifc-hive.git
# cd into the directory
cd ifc-hive
# if you only want to build container run
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
# if you want to build from source and run the containers, execute
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml -d --build
```

::: tip
In the IFC-HIVE project team we have a CI/CD pipeline for integration, staging
and production. So in that context there is no need to build the platform your
self
:::

## Build for production 

In case you want to use IFC-HIVE on your own server, the recommended
installation is the one on basis of the offical images. 

::: warning
Currently we are in the very early stages of the project and there are no Docker
images published yet. As soon as we have a version of the platform fit enough
for at least user inspection and testing, we will publish offical containers and
update this section.
:::

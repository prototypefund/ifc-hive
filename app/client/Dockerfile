# In order to keep the final Docker image as small as possible we are using a
# multi-stage build.
#   1. node container in order to install the vue, vite and all dependencies
#   2. nginx container (without node) which utelizes only the build artefacts
#      from the previous stage

# ----------------------------------------------------------------
# 1. Build stage
FROM node:16.14-alpine3.14 as build
WORKDIR /app

# add bash since alpine doesn't come with a shell
RUN apk update && apk add bash

COPY package.json .
COPY yarn.lock .

# install dependencies
ARG NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; \
      then yarn install; \
      else yarn install --production=false; \
      fi;

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; \
      then yarn run build; \
      fi;

# Ports
ENV PORT 8081
EXPOSE $PORT

# ----------------------------------------------------------------
# 2. production tage
FROM nginx:stable-alpine as production

# copy nginx configuration file 
COPY provision/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# run entrypoint.sh on every startup of the container to apply the env variables
# expose port 80
ENV PORT 80
EXPOSE $PORT

# @TODO run entrypoint to copy env variables to the index.html file

# run nginx in the forground so get logs on stdout
CMD ["nginx", "-g", "daemon off;"]

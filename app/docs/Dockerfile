# In order to keep the final Docker image as small as possible we are using a
# multi-stage build.
#   1. node container in order to install vue press and build the static site
#   2. nginx container (without node) which utelizes only the build artefacts
#      from the previous stage

# 1. Build stage
FROM node:16.14-alpine3.14 as build
WORKDIR /app

# add bash since alpine doesn't come with a shell
RUN apk update && apk add bash

COPY package.json .
COPY yarn.lock .

# register arguments
ARG NODE_ENV
ARG CI_COMMIT_SHA

RUN yarn install

# copy source files
COPY . ./

RUN sed -i "s/CI_COMMIT_SHA/${CI_COMMIT_SHA}/" ./docs/README.md

RUN if [ "$NODE_ENV" = "production" ]; \
      then yarn run build; \
      fi;

# set default values
ENV PORT 8089
# set port
EXPOSE $PORT

# 2. production tage
FROM nginx:stable-alpine as production
# copy nginx configuration file 
COPY provision/nginx.conf /etc/nginx/conf.d/default.conf
# copy the built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# copy entrypoint.sh
COPY provision/entrypoint.sh /docker-entrypoint.d/entrypoint.sh

# add bash since alpine doesn't come with a shell
RUN apk update && apk add bash # @TODO remove bash, the default shall should be sufficient
# run entrypoint.sh on every startup of the container to apply the env variables
# expose port 80
ENV PORT 80
EXPOSE $PORT

# run nginx in the forground so get logs on stdout
CMD ["nginx", "-g", "daemon off;"]

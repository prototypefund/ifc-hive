FROM node:16.14-alpine3.14
WORKDIR /app

# add bash since alpine doesn't come with a shell
RUN apk update && apk add bash

COPY package.json .
COPY yarn.lock .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
      then yarn install; \
      else yarn install --production --frozen-lockfile; \
      fi;

# copy source files
COPY . ./

# set default values
ENV PORT 3000

# set port
EXPOSE $PORT

# default command
CMD ["yarn", "run", "start"]

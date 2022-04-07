#!/bin/sh

# this files makes sure that the ethe environmental variables passed to the 
# docker container are available to the app, even though we we running in production mode. 
# Remember, the application is build as static files and node is not available.
#
# Make sure this file run every time the container is started, e.g. as an entry
# file.

CONFIG_STRING="window.configs = { VITE_APP_TEST: 'TEST ENV VARIABLE', VITE_API_BASE_URL: '${VITE_API_BASE_URL}'}"

echo "-----------------------------
  config String
  $CONFIG_STRING}
"
echo $CONFIG_STRING

# replace variables
sed -i "s@window\.configs.*@${CONFIG_STRING}@" /usr/share/nginx/html/index.html

# make the entry point a pass through which then runs the docker command. 
# this is critical for proper handling of signals to the docker container
exec "$@"


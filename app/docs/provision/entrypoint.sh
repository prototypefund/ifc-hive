 #!/bin/sh

 # this files makes sure that the ethe environmental variables passed to the
 # docker container are available to the app, even though we we running in production mode.
 # Remember, the application is build as static files and node is not available.

 # replace variables
 sed -i "s/CI_COMMIT_SHA/${CI_COMMIT_SHA}/g" /usr/share/nginx/html/index.html
 echo $CI_COMMIT_SHA > /usr/share/nginx/html/commit.txt

 # make the entry point a pass through which then runs the docker command.
 # this is critical for proper handling of signals to the docker container
 exec "$@"

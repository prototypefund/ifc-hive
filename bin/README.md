# BIN directory

This directory holds global scripts, e.g. for development, debugging or use by
the CI/CD pipeline. 

Please only place scripts and binaries here which are relevant for the global
application. Scripts which are only relevant in the context of a certain
component should be placed in the respective `./app/<component>` directory, e.g.
`./app/<component>/bin/myHelperScript.sh`

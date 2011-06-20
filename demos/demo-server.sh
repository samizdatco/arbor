#!/bin/bash
#
# a dead-simple webserver for viewing the demos locally. 
#
# usage:
#   demo-server <port-number>

# run from the root dir of the distribution since the demos depend on the
# copy of arbor.js in the lib subdirectory
cd `dirname $0`/..

# use default port if called without args
PORT=2600 
if [[ $1 =~ ^[0-9]+$ ]]
  then PORT=$1
fi

echo "Starting local http server (ctrl-c to exit)"
echo ""
echo "  Echolalia: http://127.0.0.1:$PORT/demos/echolalia/"
echo "  HalfViz:   http://127.0.0.1:$PORT/demos/halfviz/"
echo "  Atlas:     http://127.0.0.1:$PORT/demos/atlas/"
echo ""
python -m SimpleHTTPServer $PORT

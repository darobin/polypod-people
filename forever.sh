#!/bin/bash

# This is meant to be copied to the live server and run there.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
echo "Deploying…"
cd /var/www/api.polypod.space
export NODE_ENV=production
FOREVERID=$(forever list | grep '/var/www/api.polypod.space' | tr -s ' ' | cut -d ' ' -f3)
if [ -z "$FOREVERID" ]; then
  forever start /var/www/api.polypod.space/production.json;
else
  forever restart $FOREVERID;
fi

forever list
echo "Deployment operational."

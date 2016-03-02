#!/bin/sh

SERVER=$(basename `pwd`)
NGINX_CONF=/home/mcf/nginx-cloud/nginx/conf/conf.d

sed -e "s/server-name/$SERVER/" nginx.conf > $SERVER.conf

cp $SERVER.conf $NGINX_CONF

docker exec -it nginx nginx -s reload

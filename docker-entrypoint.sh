#!/bin/sh
set -e
if [ "$REST_URL" ];
    then
    sed -i "s|$REST_URL|$REST_URL|g" /usr/share/nginx/html/static/js/*.js
fi
if [ "$WEB_ROOT" ];
    then
    sed -i "s|WEB_ROOT|$WEB_ROOT|g" /usr/share/nginx/html/static/js/*.js
fi
if [ "$SOCKET_URL" ];
    then
    sed -i "s|SOCKET_URL|$SOCKET_URL|g" /usr/share/nginx/html/static/js/*.js
fi

nginx -g 'daemon off;'

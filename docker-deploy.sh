#!/bin/bash

function start() {
  read -p "Enter external web port [Default: 80]: " webport
  webport=${webport:-80}

  docker build --rm -t thumbify_me_website_image .
  docker run -d -p ${webport}:80 --name thumbify_me_website thumbify_me_website_image
}

function kill() {
  docker stop thumbify_me_website && docker rm thumbify_me_website
}

function_exists() {
  declare -f -F $1 > /dev/null
  return $?
}

if [ $# -lt 1 ]
then
  echo "Usage : $0 start|kill"
  exit
fi

case "$1" in
  start) function_exists start && start
         ;;
  kill)  function_exists kill && kill
         ;;
  *)     echo "Invalid command"
         ;;
esac

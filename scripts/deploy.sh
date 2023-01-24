#! /usr/bin/env bash

failure() {
  ~/services/notifications/slack.sh deploy-failed https://anime-list.horus.wtf/ anime-list

  exit 1
}

success() {
  ~/services/notifications/slack.sh deploy-succeeded https://anime-list.horus.wtf/ anime-list

  exit 0
}

cd /home/horus/services/anime-list

git pull

docker compose down

if [[ $? -ne 0 ]]; then
  failure
fi

docker compose build

if [[ $? -ne 0 ]]; then
  failure
fi

docker compose run anime-list yarn install

if [[ $? -ne 0 ]]; then
  failure
fi

docker compose run anime-list yarn build

if [[ $? -ne 0 ]]; then
  failure
fi

docker compose up -d

~/services/scripts/healthcheck.sh 10 https://anime-list.horus.wtf/

if [[ $? -ne 0 ]]; then
  failure
fi

success

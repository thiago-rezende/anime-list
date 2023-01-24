#! /usr/bin/env bash

failure() {
  ~/services/notifications/slack.sh deploy-failed https://anime-list.horus.wtf/ anime-list

  exit 1
}

success() {
  ~/services/notifications/slack.sh deploy-succeeded https://anime-list.horus.wtf/ anime-list

  exit 0
}

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

if [[ $? -ne 0 ]]; then
  failure
fi

~/services/scripts/healthcheck.sh 5 https://anime-list.horus.wtf/

if [[ $? -ne 0 ]]; then
  failure
fi

success

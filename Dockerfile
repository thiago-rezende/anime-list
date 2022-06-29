# Base image
FROM node:alpine

# Image labels
LABEL maintainer="Thiago Rezende <thiago.manoel.rezende@gmail.com>"
LABEL version="0.1"

# Environment variables
ENV PATH="/application/node_modules/.bin:${PATH}"

# System setup
RUN apk add --no-cache bash sudo make build-base libcap sqlite

# User permissions
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && chmod 0440 /etc/sudoers.d/node
RUN sudo setcap cap_net_bind_service=+ep /usr/local/bin/node

# Working direcotry
WORKDIR /application

# Initialization command
CMD yarn install && if [ "$WATCH_FILES" == "1" ]; then yarn watch; else yarn start; fi

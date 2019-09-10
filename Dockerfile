FROM node:12.10.0-alpine
LABEL maintainer="the native web <hello@thenativeweb.io>"

RUN apk update && \
    apk add git

RUN git config --global user.email "hello@thenativeweb.io" && \
    git config --global user.name "Sophie van Sky"

ADD . /home/node/roboter-source/

WORKDIR /home/node/app

RUN npm pack /home/node/roboter-source --silent && \
    npm install *.tgz --no-package-lock --no-save --silent && \
    rm *.tgz

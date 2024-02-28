# used by Jenkins
FROM node:16.15.1-alpine3.15
RUN apk update && apk add zip curl bash git
RUN curl -Os https://uploader.codecov.io/latest/alpine/codecov && \
    chmod +x codecov && \
    mv codecov /usr/local/bin/codecov

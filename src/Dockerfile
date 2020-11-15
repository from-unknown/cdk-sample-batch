FROM node:lts-alpine as build

ADD sample-batch/ /src/delete-batch/
WORKDIR /src/delete-batch/

RUN yarn install && yarn build

FROM node:lts-alpine as server

RUN apk update && apk upgrade

COPY --from=build /src/delete-batch/dist/ /src/

CMD ["node", "/src/bundled.js"]
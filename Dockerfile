FROM node:18-alpine
ARG CONFIG=main
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json tsconfig.json yarn.lock index.ts ./

RUN yarn --frozen-lockfile

COPY --chown=node:node . .
EXPOSE 8080

CMD [ "yarn", "up" ]

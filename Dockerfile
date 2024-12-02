# Dev stage
FROM node:lts-alpine as dev

LABEL maintainer="bafode.camara@my-digital-school.org"

WORKDIR /app

COPY package.json yarn.lock ./

# Add necessary build tools for native dependencies
RUN apk add --no-cache python3 make g++ \
    && yarn install --pure-lockfile \
    && yarn cache clean

USER node

COPY --chown=node:node . .

EXPOSE 4000

CMD ["yarn", "run", "dev"]

# Build stage
FROM node:lts-alpine as build

WORKDIR /src

ENV PATH /node_modules/.bin:$PATH

COPY package.json yarn.lock ./

# Install dependencies with the necessary build tools
RUN apk add --no-cache python3 make g++ \
    && yarn install --pure-lockfile \
    && yarn cache clean

COPY . ./

RUN yarn run build

# Prod stage
FROM nginx:alpine as prod

COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80

CMD ["yarn", "start"]

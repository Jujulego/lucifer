FROM node:14-alpine

# Args
ARG Auth0Domain
ARG Auth0Audience
ARG Auth0ClientId
ARG Auth0ClientSecret

# Create workdir
RUN mkdir /app
WORKDIR /app

# Environment
ENV NODE_ENV=production
ENV NODE_PATH=src
ENV PORT=80

ENV AUTH0_DOMAIN=$Auth0Domain
ENV AUTH0_AUDIENCE=$Auth0Audience
ENV AUTH0_CLIENT_ID=$Auth0ClientId
ENV AUTH0_CLIENT_SECRET=$Auth0ClientSecret

# Install dependencies
ADD package.json /app/
ADD yarn.lock /app/
RUN yarn install --immutable

# Copy builded files
ADD dist/apps/lucifer-api /app/src

# Setup entrypoint
ENTRYPOINT node src/main.js
EXPOSE 80

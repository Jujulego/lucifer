FROM node:14-alpine

# Create workdir
RUN mkdir /app
WORKDIR /app

# Environment
ENV NODE_ENV=production
ENV NODE_PATH=src
ENV PORT=80

# Install dependencies
ADD package.json /app/
ADD yarn.lock /app/
RUN yarn install --prod --pure-lockfile --ignore-scripts

# Copy builded files
ADD dist/apps/lucifer-api /app/src

# Setup entrypoint
ENTRYPOINT node src/main.js
EXPOSE 80

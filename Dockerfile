# Build stage
FROM node:20 AS base

# Stage for installing dependencies
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

# Build stage
FROM base AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build
RUN npm prune --production

# Deployment stage
FROM node:20-alpine3.19 AS deploy
WORKDIR /usr/src/app
RUN npm i -g prisma
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
RUN npx prisma generate

# Port configuration
EXPOSE 3333

# Command to start the application
CMD ["npm", "start"]
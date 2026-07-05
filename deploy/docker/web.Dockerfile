# syntax=docker/dockerfile:1

FROM node:22.12-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/schemas/package.json packages/schemas/package.json
RUN npm ci

COPY . .
RUN npm run generate:app-content && npm --workspace apps/web run build

FROM nginx:1.27-alpine AS runtime
COPY deploy/nginx/westlake.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

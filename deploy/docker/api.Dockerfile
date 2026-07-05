# syntax=docker/dockerfile:1

FROM node:22.12-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/schemas/package.json packages/schemas/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run generate:app-content && npm --workspace apps/api run build

FROM node:22.12-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4174 \
    LOG_LEVEL=info \
    CONTENT_CACHE_TTL_MS=1000 \
    CONTENT_ROOT=/app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY content ./content
COPY app/assets ./app/assets

EXPOSE 4174
CMD ["node", "apps/api/dist/apps/api/src/server.js"]

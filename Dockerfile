# syntax=docker/dockerfile:1

# ---- deps: install full dependency set (needed to run the TypeScript build) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: compile TypeScript to dist/ ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- prod-deps: install production-only dependencies for a lean runtime image ----
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime: minimal image shared by the api and worker services ----
# The concrete process (API server vs. BullMQ worker) is selected via the
# `command` override in docker-compose.yml, avoiding duplicate images.
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S taskflow && adduser -S taskflow -G taskflow

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER taskflow

EXPOSE 3000

CMD ["node", "dist/server.js"]

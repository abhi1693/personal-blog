# syntax=docker/dockerfile:1.7

FROM node:26.12.1-alpine3.24@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797 AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DO_NOT_TRACK=1

RUN apk upgrade --no-cache

FROM base AS deps

COPY .npmrc package.json package-lock.json ./
COPY packages/braces ./packages/braces
RUN npm ci --ignore-scripts --prefer-offline --no-audit --fund=false

FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DO_NOT_TRACK=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=env,required=true \
	node scripts/build-with-env.cjs /run/secrets/env

FROM base AS runner
WORKDIR /app

ARG APP_VERSION=dev
LABEL org.opencontainers.image.version="${APP_VERSION}"

ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
	/opt/yarn-* /usr/local/bin/npm /usr/local/bin/npx \
	/usr/local/bin/yarn /usr/local/bin/yarnpkg /usr/local/bin/corepack \
	&& addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/faro-sourcemaps ./.next/faro-sourcemaps

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

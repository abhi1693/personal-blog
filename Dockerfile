# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22.18.0-bookworm-slim
FROM ${NODE_IMAGE} AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DO_NOT_TRACK=1

COPY .npmrc package.json package-lock.json ./
RUN npm ci

FROM ${NODE_IMAGE} AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DO_NOT_TRACK=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=env,target=/app/.env.local npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# Install dependencies only when needed
FROM node:16.14-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Rebuild the source code only when needed
FROM node:16.14-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

ARG GRAPHQL_URI
ENV NEXT_PUBLIC_INDEXER_GRAPHQL_URL $GRAPHQL_URI

RUN yarn build

# Production image, copy all the files and run next
FROM node:16.14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs

FROM runner AS frontend
EXPOSE 3000
ENV PORT 3000
ENV NEXT_SHARP_PATH /app/node_modules/sharp

CMD ["npx", "next", "start"]

FROM runner AS signer
COPY --from=builder /app/tasks ./tasks
COPY --from=builder /app/src/modules ./src/modules
CMD ["yarn", "run", "consumers:sign-metadata"]

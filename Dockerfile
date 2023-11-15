#builder
FROM node:18.17.1 AS builder

RUN npm install -g pnpm@8.10.0

WORKDIR /app

COPY . .

RUN pnpm install && pnpm tsc

# CMD "/bin/sh" "-c" "pwd && ls -al"

CMD "node" "dist/index.js"

EXPOSE 8080

#final stage
FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/prisma/ ./prisma

RUN npm install -g pnpm@8.10.0 && pnpm install --frozen-lockfile

EXPOSE 8080

CMD "node" "dist/index.js"
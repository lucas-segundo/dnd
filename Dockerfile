FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base As dev

ENV API_BASE_URL http://localhost:3000

RUN pnpm fetch --prod
RUN pnpm install

# for prisma:generate
RUN apt-get update && apt-get install -y openssl 
RUN pnpm prisma:generate

FROM base As build

ENV NODE_ENV production

COPY --chown=node:node --from=dev /app/node_modules ./node_modules

RUN pnpm prisma:migrate:prod
RUN pnpm build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

USER node

FROM base As prod

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]
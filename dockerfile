FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache vips-dev build-base --repository=https://alpine.pkgs.org/3.17/alpine-edge/main/

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config ./src/config

RUN apk add --no-cache vips

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "dist/index.js"]
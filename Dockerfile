FROM node:alpine AS client-builder

WORKDIR /build

COPY ./client ./

RUN npm install --production

RUN npm run build

FROM node:alpine AS server-builder


WORKDIR /build

COPY ./server ./

RUN npm install

RUN npx tsc


FROM node:alpine

WORKDIR /app

COPY ./server/package.json ./package.json
COPY ./server/package-lock.json ./package-lock.json
COPY ./server/.npmrc ./.npmrc

RUN npm install --production

COPY --from=client-builder /build/dist ./client
COPY --from=server-builder /build/dist ./server

EXPOSE 8080

CMD ["node", "server/index.js"]
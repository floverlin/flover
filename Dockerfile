FROM node:alpine AS client-builder

WORKDIR /build

COPY ./client ./

RUN npm install --production

RUN npm run build


FROM node:alpine

WORKDIR /app

COPY ./server ./

RUN npm install --production

COPY --from=client-builder /build/dist ./dist

EXPOSE 8080

CMD ["node", "src/index.js"]
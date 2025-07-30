# Переменные окружения сервера

Используйте server/scripts/envgen.js скрипт для генерации .env

```
cd server
node scripts/envgen.js
```

```
DATABASE_URI=mongo_connection_string
PORT=port
SECRET=secret_string
ENV=dev | prod
VAPID_PUBLIC_KEY=vapid_public_key
VAPID_PRIVATE_KEY=vapid_private_key
```

# Переменные окружения для docker-compose

Как у сервера, но без:

```
ENV=prod
DATABASE_URI=mongodb://mongo:27017
```

и с:

```
CLOUDPUB_TOKEN=token_from_cloubPub
```

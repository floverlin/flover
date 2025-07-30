import webPush from "web-push";
import fs from "node:fs";

const vapidKeys = webPush.generateVAPIDKeys();

const data = `ENV=dev
SECRET=
PORT=8080
DATABASE_URI=mongodb://127.0.0.1:27017/flover
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

fs.writeFileSync(".env", data);
console.log(data);

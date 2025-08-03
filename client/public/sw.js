import { precacheAndRoute } from "workbox-precaching";

self.addEventListener("push", (e) => {
  const data = e.data.json();
  const { type, chatID, username } = data;
  const url = `/${chatID}`;

  e.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        const isVisible = clients.some(
          (client) =>
            client.visibilityState === "visible" && client.url.includes(url)
        );

        if (isVisible) return;

        const tag = `from-chat-${chatID}`;
        let title;
        let body;
        switch (type) {
          case "new-message":
            const message = data.message;
            title = "Новое сообщение!";
            body = `${username}: ${message.image ? "<изображение>" : ""} ${
              message.text || ""
            }`;
            break;
          default:
            title = "Уведомление!";
            body = "";
            break;
        }

        return self.registration.showNotification(title, {
          tag,
          body,
          renotify: true,
          icon: "/icon-192.png",
          data: { url, chatID },
        });
      })
  );
});

self.addEventListener("notificationclick", (e) => {
  console.log(e);
  e.notification.close();

  const url = e.notification.data?.url || "/";

  return self.clients.openWindow(url);
});

precacheAndRoute(self.__WB_MANIFEST);

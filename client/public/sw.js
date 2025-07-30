import { precacheAndRoute } from "workbox-precaching";

self.addEventListener("push", (e) => {
  const data = e.data.json();
  const url = data.data?.url;

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

        return self.registration.showNotification(data.title, {
          body: data.body,
          icon: "/icon-192.png",
          data: { url },
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

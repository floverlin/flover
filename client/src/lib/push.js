import { axiosInstance } from "./axios";

export async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const responce = await axiosInstance.get("/push/vapid");
  const publicKey = responce.data.publicKey;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  });

  axiosInstance.post("/push/subscribe", subscription);
  return true;
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;
  await axiosInstance.post("/push/unsubscribe", subscription);
  await subscription.unsubscribe();
  return true;
}

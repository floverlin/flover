import React, { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "../lib/push";
import toast from "react-hot-toast";

export default function NotificationToggle() {
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => (sub ? setEnabled(true) : null));
  }, []);

  const supported =
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  async function handleSubscribe() {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Уведомления запрещены");
        return;
      }
      await subscribeToPush();
      setEnabled(true);
      toast.success("Уведомления включены");
    } catch (error) {
      console.error(`Handle subscribe: ${error}`);
      toast.error("Ошибка");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      setEnabled(false);
      toast.success("Уведомления отключены");
    } catch (error) {
      console.error(`Handle unsubscribe: ${error}`);
      toast.error("Ошибка");
    } finally {
      setIsLoading(false);
    }
  }

  if (!supported)
    // if (true)
    return (
      <div className="text-warning-content bg-warning rounded px-1 text-right">
        Ваш браузер не поддерживает уведомления
      </div>
    );

  const toggle = () => {
    if (enabled) {
      handleUnsubscribe();
    } else {
      handleSubscribe();
    }
  };

  return (
    <input
      type="checkbox"
      className="toggle toggle-primary"
      onChange={toggle}
      checked={enabled}
      disabled={isLoading}
    />
  );
}

import React from "react";
import { MessageSquare } from "lucide-react";

export default function NoChat({ className }) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center gap-4 justify-center bg-base-100/50 ${className}`}
    >
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
        <MessageSquare className="size-8 text-primary" />
      </div>

      <h2 className="text-2xl font-bold">Добро пожаловать в чаты!</h2>
      <p className="text-base-content/60">
        Выберите чат в списке или найдите с помощью поиска
      </p>
    </div>
  );
}

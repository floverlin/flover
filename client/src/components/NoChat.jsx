import React from "react";
import { MessageSquare } from "lucide-react";

export default function NoChat({ className }) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-16 bg-base-100/50 ${className}`}
    >
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Добро пожаловать в чаты!</h2>
        <p className="text-base-content/60">
          Выберите чат в списке или найдите с помощью поиска
        </p>
      </div>
    </div>
  );
}

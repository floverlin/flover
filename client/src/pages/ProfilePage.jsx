import React from "react";
import { Camera, User, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { avatarPath, validateImageFile } from "../lib/utils";
import toast from "react-hot-toast";
import NotificationToggle from "../components/NotificationToggle";

export default function ProfilePage() {
  const {
    isUpdatingAvatar,
    updateAvatar,
    authUser,
    isUpdatingProfile,
    updateProfile,
  } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setEmail] = useState(authUser.email);
  const [username, setUsername] = useState(authUser.username);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    const error = validateImageFile(file);
    if (error) return toast.error(error);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateAvatar({ avatar: base64Image });
    };
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!username || !email) return; // todo
    await updateProfile({ username, email });
  }

  return (
    <div className="w-full md:w-2xl mx-auto my-2 md:my-8 bg-base-200 rounded-xl p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <p className="my-2 text-base-content/80">Информация профиля</p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="avatar relative">
          <div className="w-24 md:w-32 rounded-full">
            <img src={selectedImage || avatarPath(authUser.avatar)} />
          </div>

          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 bg-neutral hover:scale-120 p-2 rounded-full cursor-pointer transition-all ${
              isUpdatingAvatar ? "animate-pulse pointer-events-none" : ""
            }`}
          >
            <Camera className="size-5 text-neutral-content" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingAvatar}
            />
          </label>
        </div>

        <p className="text-center text-sm text-base-content/60">
          {isUpdatingAvatar
            ? "Отправка..."
            : "Нажмите на иконку камеры для загрузки аватарки"}
        </p>
      </div>

      <form
        onSubmit={handleProfileUpdate}
        className="w-full md:w-xl space-y-4 mx-auto"
      >
        <div className="space-y-1">
          <div className="text-sm text-base-content/60 w-full flex justify-center items-center gap-2">
            <User className="size-4" />
            Имя
          </div>
          <input
            className="input w-full text-center"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-base-content/60 w-full flex justify-center items-center gap-2">
            <Mail className="size-4" />
            Почта
          </div>
          <input
            className="input w-full text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          {isUpdatingProfile ? "Отправка..." : "Обновить"}
        </button>
      </form>

      <div className="w-full md:w-xl mx-auto mt-8 border-2 border-dashed border-base-content/40 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Настройки</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-base-300">
            <span>Уведомления</span>
            <NotificationToggle />
          </div>
        </div>
      </div>

      <div className="w-full md:w-xl mx-auto mt-8 border-2 border-dashed border-base-content/40 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Информация о сервисе</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-base-300">
            <span>Telegram</span>
            <a
              href="https://t.me/floverlin"
              className="link link-hover"
              target="_blank"
            >
              floverlin
            </a>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-base-300">
            <span>GitHub</span>
            <a
              href="https://github.com/floverlin"
              className="link link-hover"
              target="_blank"
            >
              floverlin
            </a>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-base-300">
            <span>Instagram</span>
            <a
              href="https://instagram.com/zxchoker"
              className="link link-hover"
              target="_blank"
            >
              zxchoker
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

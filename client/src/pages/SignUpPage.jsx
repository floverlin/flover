import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  Mail,
  MessageSquare,
  User,
  Lock,
  EyeClosed,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import NoScroll from "../components/NoScroll";
import WelcomeImage from "../components/WelcomeImage";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  function validateForm() {
    if (!formData.username.trim()) return toast.error("Имя не заполнено");

    if (!formData.email.trim()) return toast.error("Почта не заполнена");

    if (!formData.password.trim()) return toast.error("Пароль не заполнен");
    if (formData.password.trim().length < 8)
      return toast.error("Пароль должен быть не короче 8-ми символов");

    return true;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const success = validateForm();
    if (success !== true) return;
    signup(formData);
  }

  return (
    <NoScroll className="grid lg:grid-cols-2">
      {/* left */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Создать аккаунт</h1>
              <p className="text-base-content/60">
                Создайте бесплатный аккаунт
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Имя</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full px-10"
                  placeholder="Имя"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Почта</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full px-10"
                  placeholder="not.real@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Пароль</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full px-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    });
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40 z-10" />
                  ) : (
                    <EyeClosed className="size-5 text-base-content/40 z-10" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Вход...
                </>
              ) : (
                "Создать аккаунт"
              )}
            </button>
          </form>

          <div className="text-center mt-8 lg:hidden">
            <p className="text-base-content/60">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="link link-primary">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <WelcomeImage
        className="hidden lg:flex"
        title="Присоединяйтесь к сообществу flover"
        text="Оставайтесь на связи с близкими в любое время, в любом месте. Присоединяйтесь и начинайте общение!"
        linkAddr="/login"
        linkText="Уже есть аккаунт?"
      />
    </NoScroll>
  );
}

import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  Eye,
  EyeClosed,
  Mail,
  Lock,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import WelcomeImage from "../components/WelcomeImage";
import NoScroll from "../components/NoScroll";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  function validateForm() {
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
    login(formData);
  }

  return (
    <NoScroll className="grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Вход</h1>
              <p className="text-base-content/60">Войдите в аккаунт</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          <div className="text-center mt-8 lg:hidden">
            <p className="text-base-content/60">
              Нет аккаунта?{" "}
              <Link to="/signup" className="link link-primary">
                Создать
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <WelcomeImage
        className="hidden lg:flex"
        title="Добро пожаловать в flover"
        text="Оставайтесь на связи с близкими в любое время, в любом месте. Присоединяйтесь и начинайте общение!"
        linkAddr="/signup"
        linkText="Нет аккаунта?"
      />
    </NoScroll>
  );
}

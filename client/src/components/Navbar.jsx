import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Bird, User, Palette } from "lucide-react";
import { Link } from "react-router";

export default function Navbar({ heigth }) {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className={`border-b border-base-300 fixed w-full top-0 z-50 backdrop-blur-sm bg-base-100/5 px-4 md:px-8 ${heigth}`}
    >
      <div className="flex items-center justify-between h-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/5 transition-colors">
            <Bird className="size-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-base-content/80 hover:text-base-content transition-colors">
            фловер
          </h1>
        </Link>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          <Link to="/colors" className="btn btn-sm gap-2">
            <Palette className="size-4" />
            <span className="hidden md:inline">Цвета</span>
          </Link>
          {authUser && (
            <>
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="size-4" />
                <span className="hidden md:inline">Профиль</span>
              </Link>

              <button className="btn btn-sm gap-2" onClick={logout}>
                <LogOut className="size-4" />
                <span className="hidden md:inline">Выйти</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

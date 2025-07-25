import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Bird, Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import NotFoundPage from "./pages/NotFoundPage";
import ColorsPage from "./pages/ColorsPage";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    // if (true)
    return (
      <Main className="justify-center gap-8">
        <div className="geist flex gap-2 text-6xl font-bold text-primary">
          <Bird className="size-12" />
          flover
        </div>
        <Loader className="size-14 animate-spin text-primary" />
      </Main>
    );

  return (
    <Main>
      <Navbar heigth="h-12 md:h-16" />

      <div className="pt-12 md:pt-16 w-full min-h-screen">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/colors" element={<ColorsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={authUser ? <NotFoundPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      <Toaster />
    </Main>
  );
}

function Main({ children, className }) {
  const { theme } = useThemeStore();
  return (
    <main
      data-theme={theme}
      className={`geist min-h-screen w-full flex flex-col items-center ${
        className ? className : ""
      }`}
    >
      {children}
    </main>
  );
}

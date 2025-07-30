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
      <Theme>
        <Geist>
          <Main scrollable={false} className="justify-center gap-8">
            <div className="flex gap-2 text-6xl font-bold text-primary">
              <Bird className="size-18" />
              фловер
            </div>
            <Loader className="size-14 animate-spin text-primary" />
          </Main>
        </Geist>
      </Theme>
    );

  return (
    <Theme>
      <Geist>
        <Navbar heigth="h-12 md:h-16" />

        <Main scrollable={false} className="pt-12 md:pt-16">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            >
              <Route path=":chatID" element={<></>} />
            </Route>
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

          <Toaster />
        </Main>
      </Geist>
    </Theme>
  );
}

function Main({ children, className, scrollable = true }) {
  return (
    <main
      className={`h-[100svh] w-screen flex flex-col items-center overflow-y-auto ${
        scrollable ? "" : "overflow-y-hidden"
      } ${className ? className : ""}`}
    >
      {children}
    </main>
  );
}

function Theme({ children }) {
  const { theme } = useThemeStore();
  return <div data-theme={theme}>{children}</div>;
}

function Geist({ children }) {
  return <div className="geist">{children}</div>;
}

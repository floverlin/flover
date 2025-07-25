import React from "react";

export default function NoScroll({ children, className }) {
  return (
    <div
      className={`h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)] ${className}`}
    >
      {children}
    </div>
  );
}

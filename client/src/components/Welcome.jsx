import React from "react";
import { Link } from "react-router";

export default function Welcome({
  className,
  title,
  text,
  linkText,
  linkAddr,
}) {
  return (
    <div className={className}>
      <div
        className="hero h-full"
        style={{
          backgroundImage: "url(/welcome.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">{title}</h1>
            <p className="mb-5">{text}</p>
            <Link to={linkAddr} className="btn btn-primary">
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function Scroller({ children, ref, className = "" }) {
  return (
    <div ref={ref} className={`w-full h-full overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

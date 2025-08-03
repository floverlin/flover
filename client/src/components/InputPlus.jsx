import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

export default function InputPlus({
  value = "",
  placeholder,
  ref: outerRef = null,
  onChange,
  onEnter,
}) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!innerRef.current) return;
    const inner = innerRef.current;
    inner.style.height = "auto";
    inner.style.height = `${inner.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      rows="1"
      ref={(el) => {
        if (outerRef) outerRef.current = el;
        innerRef.current = el;
      }}
      type="text"
      className="flex-1 textarea size-full text-base resize-none min-h-10 max-h-60 overflow-y-auto border-0"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onEnter(e);
        }
      }}
    />
  );
}

import { Globe, Search } from "lucide-react";
import React from "react";

export default function ChatSearch({ value, onChange, disabled = false, ref = null }) {
  return (
    <div className="p-2 border-b border-base-300 w-full">
      <label className="input w-full">
        <Search className="size-6 text-primary/80" />
        <input
          ref={ref}
          type="search"
          className="input text-base"
          value={disabled ? "" : value}
          onChange={onChange}
          disabled={disabled}
        />
        <Globe className="size-6 text-primary/80" />
      </label>
    </div>
  );
}

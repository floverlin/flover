import { Globe, Search } from "lucide-react";
import React from "react";

export default function ChatSearch({ value, onChange }) {
  return (
    <div className="p-2 border-b border-base-300 w-full">
      <label className="input w-full">
        <Search className="size-6 text-primary/80" />
        <input
          type="search"
          className="input"
          value={value}
          onChange={onChange}
        />
        <Globe className="size-6 text-primary/80" />
      </label>
    </div>
  );
}

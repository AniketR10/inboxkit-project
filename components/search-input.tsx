"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const SearchInput = ({ placeholder = "Search..." }: { placeholder?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set("query", value);
        params.set("page", "1");
      } else {
        params.delete("query");
      }

      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-3 pr-4 py-2 border-2 border-black shadow-neo outline-none focus:ring-2 ring-black/20 text-sm font-bold"
      />
    </div>
  );
};

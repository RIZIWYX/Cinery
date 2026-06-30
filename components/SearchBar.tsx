"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const trimmed = query.trim();

    const timeout = setTimeout(() => {
      if (trimmed.length === 0) {
        return;
      }
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full sm:max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film..."
          className="w-full rounded-full bg-neutral-900 border border-neutral-700 px-4 py-2 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          aria-label="Rechercher"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
        >
          &#128269;
        </button>
      </div>
    </form>
  );
}

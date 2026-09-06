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
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cinery-gray">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film..."
          className="w-full rounded-full bg-cinery-surface/70 backdrop-blur-sm border border-cinery-accent/30 pl-11 pr-4 py-2.5 text-sm text-cinery-white placeholder:text-cinery-gray focus:outline-none focus:border-cinery-accent focus:bg-cinery-surface transition-colors"
        />
      </div>
    </form>
  );
}

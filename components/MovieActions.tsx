"use client";

import { useState, useTransition } from "react";
import { toggleMovieInList } from "@/lib/actions";
import type { MovieStatus } from "@prisma/client";

type MovieActionsProps = {
  movieId: number;
  initialStatuses: MovieStatus[];
  isAuthenticated: boolean;
};

type StatusConfig = {
  status: MovieStatus;
  label: string;
  icon: string;
  activeClass: string;
};

const CONFIGS: StatusConfig[] = [
  {
    status: "FAVORITE" as MovieStatus,
    label: "Favori",
    icon: "\u2764",
    activeClass: "bg-red-600 border-red-600 text-white",
  },
  {
    status: "WATCHED" as MovieStatus,
    label: "Vu",
    icon: "\u2713",
    activeClass: "bg-green-600 border-green-600 text-white",
  },
  {
    status: "TO_WATCH" as MovieStatus,
    label: "A voir",
    icon: "\u2605",
    activeClass: "bg-cinery-accent border-cinery-accent text-white",
  },
];

export default function MovieActions({
  movieId,
  initialStatuses,
  isAuthenticated,
}: MovieActionsProps) {
  const [statuses, setStatuses] = useState<Set<MovieStatus>>(
    new Set(initialStatuses)
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="mt-4 rounded-lg bg-cinery-surface border border-white/10 p-4 text-center">
        <p className="text-sm text-cinery-gray">
          <a href="/login" className="text-cinery-accent underline hover:text-cinery-accent-hover">
            Connectez-vous
          </a>{" "}
          pour ajouter ce film a vos listes.
        </p>
      </div>
    );
  }

  function handleToggle(status: MovieStatus) {
    setError(null);
    const wasActive = statuses.has(status);

    const newStatuses = new Set(statuses);
    if (wasActive) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setStatuses(newStatuses);

    startTransition(async () => {
      const result = await toggleMovieInList(movieId, status);

      if (!result.success) {
        setStatuses(statuses);
        setError(result.error);
      }
    });
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {CONFIGS.map((config) => {
          const isActive = statuses.has(config.status);
          return (
            <button
              key={config.status}
              onClick={() => handleToggle(config.status)}
              disabled={isPending}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                isActive
                  ? config.activeClass
                  : "border-white/15 bg-cinery-surface text-cinery-gray hover:border-cinery-accent hover:text-cinery-white"
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

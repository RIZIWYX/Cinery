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
    activeClass: "bg-blue-600 border-blue-600 text-white",
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
      <div className="mt-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4 text-center">
        <p className="text-sm text-neutral-400">
          <a href="/login" className="text-white underline hover:text-neutral-300">
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

    // Optimistic update : on met à jour l'UI immédiatement
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
        // Rollback si erreur
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
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
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

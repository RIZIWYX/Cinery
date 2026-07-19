import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserMoviesByStatus } from "@/lib/actions";
import { getMovieDetails } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

export const metadata = {
  title: "Mes listes - Cinery",
};

async function fetchMoviesForStatus(movieIds: number[]) {
  const results = await Promise.allSettled(
    movieIds.map((id) => getMovieDetails(id))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getMovieDetails>>> => r.status === "fulfilled")
    .map((r) => r.value);
}

export default async function ListsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const [favoriteIds, watchedIds, toWatchIds] = await Promise.all([
    getUserMoviesByStatus("FAVORITE"),
    getUserMoviesByStatus("WATCHED"),
    getUserMoviesByStatus("TO_WATCH"),
  ]);

  const [favorites, watched, toWatch] = await Promise.all([
    fetchMoviesForStatus(favoriteIds),
    fetchMoviesForStatus(watchedIds),
    fetchMoviesForStatus(toWatchIds),
  ]);

  const isEmpty =
    favorites.length === 0 && watched.length === 0 && toWatch.length === 0;

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mes listes</h1>
        <p className="text-neutral-400 mb-8">
          Retrouvez vos films favoris, deja vus et a voir plus tard.
        </p>

        {isEmpty ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center">
            <p className="text-neutral-400 mb-4">
              Vous n&apos;avez pas encore ajoute de films a vos listes.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-white text-black text-sm font-medium px-6 py-2 hover:bg-neutral-200 transition-colors"
            >
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {favorites.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-red-500">&#10084;</span>
                  Favoris
                  <span className="text-sm font-normal text-neutral-500">
                    ({favorites.length})
                  </span>
                </h2>
                <MovieGrid movies={favorites} />
              </section>
            )}

            {watched.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span>
                  Deja vus
                  <span className="text-sm font-normal text-neutral-500">
                    ({watched.length})
                  </span>
                </h2>
                <MovieGrid movies={watched} />
              </section>
            )}

            {toWatch.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-blue-500">&#9733;</span>
                  A voir
                  <span className="text-sm font-normal text-neutral-500">
                    ({toWatch.length})
                  </span>
                </h2>
                <MovieGrid movies={toWatch} />
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

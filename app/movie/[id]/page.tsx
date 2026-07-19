import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MovieGrid from "@/components/MovieGrid";
import CastCard from "@/components/CastCard";
import MovieActions from "@/components/MovieActions";
import { auth } from "@/lib/auth";
import { getMovieStatusForUser } from "@/lib/actions";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getBackdropUrl,
  getPosterUrl,
} from "@/lib/tmdb";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) {
    return { title: "Film introuvable" };
  }

  try {
    const movie = await getMovieDetails(movieId);
    const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";
    return {
      title: `${movie.title}${year ? ` (${year})` : ""}`,
      description: movie.overview || `Decouvrez ${movie.title} sur Cinery.`,
    };
  } catch {
    return { title: "Film introuvable" };
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    notFound();
  }

  let movie, cast, similar;

  try {
    [movie, cast, similar] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getSimilarMovies(movieId),
    ]);
  } catch {
    notFound();
  }

  const session = await auth();
  const isAuthenticated = !!session?.user?.email;
  const userStatuses = isAuthenticated
    ? await getMovieStatusForUser(movieId)
    : [];

  const backdropUrl = getBackdropUrl(movie.backdropPath);
  const posterUrl = getPosterUrl(movie.posterPath);
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";
  const rating = movie.voteAverage.toFixed(1);
  const runtime = formatRuntime(movie.runtime);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-[60vh] w-full">
        {movie.backdropPath && (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <Link
          href="/"
          className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur hover:bg-black/80"
        >
          &larr; Retour
        </Link>
      </div>

      <div className="relative -mt-32 px-4 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative w-40 sm:w-56 shrink-0 self-start aspect-[2/3] overflow-hidden rounded-lg shadow-2xl">
            {movie.posterPath && (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 160px, 224px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-2 text-lg italic text-neutral-400">
                {movie.tagline}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <span className="font-semibold text-yellow-400">&#9733; {rating}</span>
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <MovieActions
              movieId={movieId}
              initialStatuses={userStatuses}
              isAuthenticated={isAuthenticated}
            />

            {movie.overview && (
              <div className="mt-6">
                <h2 className="mb-2 text-xl font-bold text-white">Synopsis</h2>
                <p className="text-neutral-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section className="px-4 sm:px-8 py-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-bold text-white">
            Distribution
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((member) => (
              <CastCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      <MovieGrid title="Films similaires" movies={similar.slice(0, 12)} />

      <footer className="px-4 sm:px-8 py-8 text-center text-xs text-neutral-500 border-t border-neutral-800 mt-8">
        <p>
          Donnees fournies par <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">The Movie Database (TMDB)</a>.
        </p>
      </footer>
    </main>
  );
}

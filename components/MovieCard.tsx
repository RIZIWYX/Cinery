import Image from "next/image";
import Link from "next/link";
import { getPosterUrl, type Movie } from "@/lib/tmdb";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.posterPath, "w342");
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";
  const rating = movie.voteAverage.toFixed(1);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block w-40 sm:w-48 shrink-0 overflow-hidden rounded-lg bg-neutral-900 transition-transform hover:scale-105"
    >
      <div className="relative aspect-[2/3] w-full">
        {movie.posterPath ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 160px, 192px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-500">
            Pas d&apos;affiche
          </div>
        )}

        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-yellow-400">
          ★ {rating}
        </div>
      </div>

      <div className="p-2">
        <h3 className="line-clamp-1 text-sm font-medium text-white">
          {movie.title}
        </h3>
        {year && (
          <p className="text-xs text-neutral-400">{year}</p>
        )}
      </div>
    </Link>
  );
}

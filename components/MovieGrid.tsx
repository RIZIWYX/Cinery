import { type Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

type MovieGridProps = {
  title?: string;
  movies: Movie[];
};

export default function MovieGrid({ title, movies }: MovieGridProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-8 py-6">
      {title && (
        <h2 className="mb-4 text-xl sm:text-2xl font-bold text-white">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

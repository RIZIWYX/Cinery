
import { type Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

type MovieRowProps = {
  title: string;
  movies: Movie[];
};

export default function MovieRow({ title, movies }: MovieRowProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-8 py-6">
      <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

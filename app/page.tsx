import MovieRow from "@/components/MovieRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [trending, popular, nowPlaying, topRated] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
  ]);

  return (
    <main className="min-h-screen">
      <MovieRow title="Tendances de la semaine" movies={trending} />
      <MovieRow title="Films populaires en ce moment" movies={popular} />
      <MovieRow title="Au cinema pres de chez vous" movies={nowPlaying} />
      <MovieRow title="Les mieux notes de tous les temps" movies={topRated} />

      <footer className="px-4 sm:px-8 py-8 text-center text-xs text-neutral-500 border-t border-neutral-800 mt-8">
        <p>
          Donnees fournies par <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">The Movie Database (TMDB)</a>.
        </p>
        <p className="mt-2">Ce produit utilise l&apos;API TMDB mais n&apos;est pas approuve ni certifie par TMDB.</p>
      </footer>
    </main>
  );
}

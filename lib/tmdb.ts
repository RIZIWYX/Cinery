// Client TMDB — toutes les requêtes vers l'API TMDB passent par ici.

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("TMDB_ACCESS_TOKEN n'est pas défini dans .env.local");
}

/** Représentation d'un film côté Cinery. */
export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

/** Représentation brute de l'API TMDB (utilisée seulement en interne). */
type TMDBMovieRaw = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

/** Convertit la réponse brute de TMDB en notre Movie. */
function toMovie(raw: TMDBMovieRaw): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average,
  };
}

/** Appel générique à l'API TMDB. */
async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // cache 1h côté Next.js
  });

  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

type TMDBListResponse = {
  results: TMDBMovieRaw[];
};

/** Films populaires en France. */
export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/popular?language=fr-FR&region=FR"
  );
  return data.results.map(toMovie);
}

/** Films tendance de la semaine. */
export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/trending/movie/week?language=fr-FR"
  );
  return data.results.map(toMovie);
}

/** Films actuellement au cinéma en France. */
export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/now_playing?language=fr-FR&region=FR"
  );
  return data.results.map(toMovie);
}

/** Films les mieux notés de tous les temps. */
export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/top_rated?language=fr-FR"
  );
  return data.results.map(toMovie);
}

/** Construit l'URL d'une affiche TMDB. */
export function getPosterUrl(
  posterPath: string | null,
  size: "w200" | "w342" | "w500" | "original" = "w500"
): string {
  if (!posterPath) {
    return "/placeholder-poster.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

/** Construit l'URL d'un backdrop (image de fond panoramique). */
export function getBackdropUrl(
  backdropPath: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
): string {
  if (!backdropPath) {
    return "/placeholder-backdrop.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`;
}

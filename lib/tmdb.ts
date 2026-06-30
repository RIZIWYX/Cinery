// Client TMDB — toutes les requêtes vers l'API TMDB passent par ici.

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("TMDB_ACCESS_TOKEN n'est pas defini dans .env.local");
}

/** Representation d'un film cote Cinery. */
export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

/** Details complets d'un film. */
export type MovieDetails = Movie & {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string | null;
  budget: number;
  revenue: number;
};

/** Un membre du casting. */
export type CastMember = {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
};

/** Representation brute de l'API TMDB. */
type TMDBMovieRaw = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

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

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

type TMDBListResponse = {
  results: TMDBMovieRaw[];
};

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/popular?language=fr-FR&region=FR"
  );
  return data.results.map(toMovie);
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/trending/movie/week?language=fr-FR"
  );
  return data.results.map(toMovie);
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/now_playing?language=fr-FR&region=FR"
  );
  return data.results.map(toMovie);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    "/movie/top_rated?language=fr-FR"
  );
  return data.results.map(toMovie);
}

/** Details complets d'un film par son ID TMDB. */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  type DetailsResponse = TMDBMovieRaw & {
    runtime: number | null;
    genres: { id: number; name: string }[];
    tagline: string | null;
    budget: number;
    revenue: number;
  };

  const raw = await fetchTMDB<DetailsResponse>(`/movie/${id}?language=fr-FR`);

  return {
    ...toMovie(raw),
    runtime: raw.runtime,
    genres: raw.genres,
    tagline: raw.tagline,
    budget: raw.budget,
    revenue: raw.revenue,
  };
}

/** Casting principal d'un film. */
export async function getMovieCredits(id: number): Promise<CastMember[]> {
  type CreditsResponse = {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };

  const data = await fetchTMDB<CreditsResponse>(
    `/movie/${id}/credits?language=fr-FR`
  );

  return data.cast.slice(0, 10).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profilePath: c.profile_path,
  }));
}

/** Films similaires a un film donne. */
export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    `/movie/${id}/similar?language=fr-FR`
  );
  return data.results.map(toMovie);
}

/** Recherche de films par titre. */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) {
    return [];
  }

  const encoded = encodeURIComponent(query);
  const data = await fetchTMDB<TMDBListResponse>(
    `/search/movie?query=${encoded}&language=fr-FR&include_adult=false`
  );
  return data.results.map(toMovie);
}

export function getPosterUrl(
  posterPath: string | null,
  size: "w200" | "w342" | "w500" | "original" = "w500"
): string {
  if (!posterPath) {
    return "/placeholder-poster.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export function getBackdropUrl(
  backdropPath: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
): string {
  if (!backdropPath) {
    return "/placeholder-backdrop.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`;
}

/** Construit l'URL d'une photo de profil d'acteur. */
export function getProfileUrl(
  profilePath: string | null,
  size: "w185" | "h632" | "original" = "w185"
): string {
  if (!profilePath) {
    return "/placeholder-profile.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${profilePath}`;
}

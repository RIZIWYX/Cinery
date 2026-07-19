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

/** Une video (bande-annonce, teaser, etc.). */
export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

/** Une plateforme de streaming ou d'achat. */
export type WatchProvider = {
  providerId: number;
  providerName: string;
  logoPath: string | null;
};

/** Toutes les options de visionnage pour un film. */
export type WatchProviders = {
  link: string | null;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
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

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBListResponse>(
    `/movie/${id}/similar?language=fr-FR`
  );
  return data.results.map(toMovie);
}

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

/** Recupere les videos (bandes-annonces, teasers) d'un film. */
export async function getMovieVideos(id: number): Promise<MovieVideo[]> {
  type VideosResponse = {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      iso_639_1: string;
    }[];
  };

  // On essaie d'abord en francais
  const dataFr = await fetchTMDB<VideosResponse>(
    `/movie/${id}/videos?language=fr-FR`
  );

  let videos = dataFr.results;

  // Si aucune video en francais, on tente en anglais
  if (videos.length === 0) {
    const dataEn = await fetchTMDB<VideosResponse>(
      `/movie/${id}/videos?language=en-US`
    );
    videos = dataEn.results;
  }

  return videos
    .filter((v) => v.site === "YouTube")
    .sort((a, b) => {
      // Priorite : Trailer officiel > Trailer > Teaser > autres
      const typeScore = (v: typeof a) => {
        if (v.type === "Trailer" && v.official) return 4;
        if (v.type === "Trailer") return 3;
        if (v.type === "Teaser") return 2;
        return 1;
      };
      return typeScore(b) - typeScore(a);
    })
    .map((v) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official,
    }));
}

/** Recupere les plateformes de streaming pour un film (region FR). */
export async function getWatchProviders(id: number): Promise<WatchProviders> {
  type ProvidersResponse = {
    results: {
      FR?: {
        link: string;
        flatrate?: {
          provider_id: number;
          provider_name: string;
          logo_path: string | null;
        }[];
        rent?: {
          provider_id: number;
          provider_name: string;
          logo_path: string | null;
        }[];
        buy?: {
          provider_id: number;
          provider_name: string;
          logo_path: string | null;
        }[];
      };
    };
  };

  const data = await fetchTMDB<ProvidersResponse>(
    `/movie/${id}/watch/providers`
  );

  const fr = data.results.FR;

  if (!fr) {
    return { link: null, flatrate: [], rent: [], buy: [] };
  }

  function mapProvider(p: {
    provider_id: number;
    provider_name: string;
    logo_path: string | null;
  }): WatchProvider {
    return {
      providerId: p.provider_id,
      providerName: p.provider_name,
      logoPath: p.logo_path,
    };
  }

  return {
    link: fr.link ?? null,
    flatrate: (fr.flatrate ?? []).map(mapProvider),
    rent: (fr.rent ?? []).map(mapProvider),
    buy: (fr.buy ?? []).map(mapProvider),
  };
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

export function getProfileUrl(
  profilePath: string | null,
  size: "w185" | "h632" | "original" = "w185"
): string {
  if (!profilePath) {
    return "/placeholder-profile.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${profilePath}`;
}

export function getLogoUrl(
  logoPath: string | null,
  size: "w45" | "w92" | "w154" | "w185" | "original" = "w92"
): string {
  if (!logoPath) {
    return "/placeholder-logo.png";
  }
  return `${TMDB_IMAGE_BASE}/${size}${logoPath}`;
}

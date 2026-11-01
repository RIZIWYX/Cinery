import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getBackdropUrl,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getPopularMovies,
  getPosterUrl,
  getProfileUrl,
  getWatchProviders,
  searchMovies,
} from "../lib/tmdb";

/** Remplace fetch : chaque appel renvoie la réponse suivante de la liste. */
function simulerTMDB(...reponses: unknown[]) {
  const fetchMock = vi.fn();
  for (const r of reponses) {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, statusText: "OK", json: async () => r });
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const filmBrut = {
  id: 550,
  title: "Fight Club",
  overview: "Un employé de bureau insomniaque...",
  poster_path: "/affiche.jpg",
  backdrop_path: "/fond.jpg",
  release_date: "1999-10-15",
  vote_average: 8.4,
};

afterEach(() => vi.unstubAllGlobals());

describe("URL des images", () => {
  it("construit l'URL TMDB avec la taille demandée", () => {
    expect(getPosterUrl("/a.jpg", "w342")).toBe("https://image.tmdb.org/t/p/w342/a.jpg");
    expect(getBackdropUrl("/b.jpg")).toBe("https://image.tmdb.org/t/p/w1280/b.jpg");
  });

  it("renvoie une image de remplacement si le chemin est absent", () => {
    expect(getPosterUrl(null)).toBe("/placeholder-poster.png");
    expect(getBackdropUrl(null)).toBe("/placeholder-backdrop.png");
    expect(getProfileUrl(null)).toBe("/placeholder-profile.png");
  });
});

describe("appels à l'API TMDB", () => {
  it("envoie le jeton et convertit les films au format Cinery", async () => {
    const fetchMock = simulerTMDB({ results: [filmBrut] });
    const films = await getPopularMovies();

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/movie/popular");
    expect(options.headers.Authorization).toBe("Bearer jeton-de-test");
    expect(films).toEqual([
      {
        id: 550,
        title: "Fight Club",
        overview: "Un employé de bureau insomniaque...",
        posterPath: "/affiche.jpg",
        backdropPath: "/fond.jpg",
        releaseDate: "1999-10-15",
        voteAverage: 8.4,
      },
    ]);
  });

  it("lève une erreur si TMDB répond avec un code d'erreur", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401, statusText: "Unauthorized" }),
    );
    await expect(getMovieDetails(1)).rejects.toThrow("TMDB error 401");
  });

  it("garde les champs détaillés d'un film", async () => {
    simulerTMDB({ ...filmBrut, runtime: 139, genres: [{ id: 18, name: "Drame" }], tagline: null, budget: 63e6, revenue: 1e8 });
    const film = await getMovieDetails(550);
    expect(film.runtime).toBe(139);
    expect(film.genres).toEqual([{ id: 18, name: "Drame" }]);
    expect(film.posterPath).toBe("/affiche.jpg");
  });

  it("limite le casting aux 10 premiers acteurs", async () => {
    const cast = Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Acteur ${i}`, character: "Rôle", profile_path: null }));
    simulerTMDB({ cast });
    const acteurs = await getMovieCredits(550);
    expect(acteurs).toHaveLength(10);
    expect(acteurs[0]).toEqual({ id: 0, name: "Acteur 0", character: "Rôle", profilePath: null });
  });
});

describe("recherche", () => {
  it("n'appelle pas l'API pour une recherche vide", async () => {
    const fetchMock = simulerTMDB();
    expect(await searchMovies("   ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("encode la requête dans l'URL", async () => {
    const fetchMock = simulerTMDB({ results: [] });
    await searchMovies("le roi & moi");
    expect(fetchMock.mock.calls[0][0]).toContain("query=le%20roi%20%26%20moi");
  });
});

describe("bandes-annonces", () => {
  const video = (id: string, type: string, official: boolean, site = "YouTube") => ({
    id, key: `cle-${id}`, name: id, site, type, official, iso_639_1: "fr",
  });

  it("garde YouTube et classe : trailer officiel, trailer, teaser, autres", async () => {
    simulerTMDB({
      results: [
        video("coulisses", "Featurette", true),
        video("teaser", "Teaser", true),
        video("vimeo", "Trailer", true, "Vimeo"),
        video("trailer", "Trailer", false),
        video("officiel", "Trailer", true),
      ],
    });
    const videos = await getMovieVideos(550);
    expect(videos.map((v) => v.id)).toEqual(["officiel", "trailer", "teaser", "coulisses"]);
  });

  it("passe en anglais si aucune vidéo française n'existe", async () => {
    const fetchMock = simulerTMDB({ results: [] }, { results: [video("en", "Trailer", true)] });
    const videos = await getMovieVideos(550);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("language=en-US");
    expect(videos.map((v) => v.id)).toEqual(["en"]);
  });
});

describe("plateformes de streaming", () => {
  it("renvoie des listes vides si le film n'est pas disponible en France", async () => {
    simulerTMDB({ results: {} });
    expect(await getWatchProviders(550)).toEqual({ link: null, flatrate: [], rent: [], buy: [] });
  });

  it("convertit les plateformes françaises", async () => {
    simulerTMDB({
      results: {
        FR: {
          link: "https://www.themoviedb.org/movie/550/watch",
          flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: "/n.jpg" }],
        },
      },
    });
    const p = await getWatchProviders(550);
    expect(p.flatrate).toEqual([{ providerId: 8, providerName: "Netflix", logoPath: "/n.jpg" }]);
    expect(p.rent).toEqual([]);
  });
});

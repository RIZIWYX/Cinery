import { searchMovies } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Recherche : ${q}` : "Recherche",
  };
}
export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = query.length > 0 ? await searchMovies(query) : [];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="px-4 sm:px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {query ? `Resultats pour "${query}"` : "Recherche"}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          {results.length > 0
            ? `${results.length} film(s) trouve(s)`
            : query
              ? "Aucun film trouve pour cette recherche."
              : "Tapez le titre d'un film pour le chercher."}
        </p>
      </header>

      {results.length > 0 && <MovieGrid movies={results} />}
    </main>
  );
}

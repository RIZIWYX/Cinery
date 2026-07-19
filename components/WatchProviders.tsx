import Image from "next/image";
import { getLogoUrl, type WatchProviders as WatchProvidersType } from "@/lib/tmdb";

type WatchProvidersProps = {
  providers: WatchProvidersType;
};

export default function WatchProviders({ providers }: WatchProvidersProps) {
  const hasAny = providers.flatrate.length > 0 || providers.rent.length > 0 || providers.buy.length > 0;

  if (!hasAny) {
    return (
      <section className="px-4 sm:px-8 py-6">
        <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">Ou regarder</h2>
        <p className="text-sm text-neutral-500">Aucune plateforme disponible en France pour ce film pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-8 py-6">
      <h2 className="mb-4 text-xl sm:text-2xl font-bold text-white">Ou regarder ce film</h2>

      <div className="space-y-4">
        {providers.flatrate.length > 0 && (<ProviderRow title="Abonnement (streaming)" providers={providers.flatrate} />)}
        {providers.rent.length > 0 && (<ProviderRow title="Location" providers={providers.rent} />)}
        {providers.buy.length > 0 && (<ProviderRow title="Achat" providers={providers.buy} />)}
      </div>

      {providers.link && (<a href={providers.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">Voir toutes les options sur JustWatch &rarr;</a>)}

      <p className="mt-3 text-xs text-neutral-600">Donnees fournies par JustWatch via TMDB. Les plateformes peuvent evoluer.</p>
    </section>
  );
}

type ProviderRowProps = {
  title: string;
  providers: WatchProvidersType["flatrate"];
};

function ProviderRow({ title, providers }: ProviderRowProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-neutral-400 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {providers.map((p) => (
          <div key={p.providerId} className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2" title={p.providerName}>
            {p.logoPath && (
              <div className="relative w-8 h-8 overflow-hidden rounded">
                <Image src={getLogoUrl(p.logoPath)} alt={p.providerName} fill sizes="32px" className="object-cover" />
              </div>
            )}
            <span className="text-sm text-white">{p.providerName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

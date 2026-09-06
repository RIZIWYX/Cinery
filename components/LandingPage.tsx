import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/header.png"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinery-bg via-cinery-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinery-bg via-cinery-bg/20 to-transparent" />
      </div>

      <div className="relative z-10 px-6 sm:px-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-12 h-12">
            <Image src="/logo.png" alt="Cinery" fill sizes="48px" className="object-contain" priority />
          </div>
          <span className="text-3xl font-bold tracking-widest text-cinery-white">
            CINERY
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-cinery-white leading-[1.05] drop-shadow-lg">
          LE CIN&Eacute;MA,{" "}
          <span className="text-cinery-accent">SANS LIMITES.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-cinery-gray max-w-md">
          D&eacute;couvrez, sauvegardez et suivez vos films pr&eacute;f&eacute;r&eacute;s.
          Une exp&eacute;rience sur mesure, en qualit&eacute; 4K.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-full bg-cinery-accent text-cinery-white text-sm sm:text-base font-bold uppercase tracking-wide px-9 py-3.5 shadow-lg shadow-cinery-accent/30 hover:bg-cinery-accent-hover hover:scale-105 transition-all"
          >
            Commencer
          </Link>

        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cinery-accent">Contenu</p>
            <p className="text-xs text-cinery-gray">Premium</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cinery-accent">Ma liste</p>
            <p className="text-xs text-cinery-gray">Personnalis&eacute;e</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cinery-accent">Exp&eacute;rience</p>
            <p className="text-xs text-cinery-gray">Sur mesure</p>
          </div>
        </div>
      </div>
    </div>
  );
}

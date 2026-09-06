import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-cinery-accent text-cinery-white text-sm font-medium px-4 py-1.5 hover:bg-cinery-accent-hover transition-colors"
      >
        Se connecter
      </Link>
    );
  }

  const { name, image } = session.user;
  const displayName = name ?? "Utilisateur";
  const initials = displayName
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 group shrink-0"
    >
      {image ? (
        <div className="relative w-9 h-9 overflow-hidden rounded-full ring-2 ring-cinery-accent/60 group-hover:ring-cinery-accent transition-all">
          <Image
            src={image}
            alt={displayName}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-cinery-surface ring-2 ring-cinery-accent/60 group-hover:ring-cinery-accent flex items-center justify-center text-xs font-semibold text-cinery-white transition-all">
          {initials}
        </div>
      )}
      <span className="hidden sm:inline text-sm font-medium tracking-wide text-cinery-white uppercase">
        {displayName}
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-cinery-gray group-hover:text-cinery-white transition-colors">
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

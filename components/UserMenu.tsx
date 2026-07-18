import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-white text-black text-sm font-medium px-4 py-1.5 hover:bg-neutral-200 transition-colors"
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
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {image ? (
          <div className="relative w-8 h-8 overflow-hidden rounded-full">
            <Image
              src={image}
              alt={displayName}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-sm text-neutral-200">
          {displayName}
        </span>
      </Link>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Deconnexion
        </button>
      </form>
    </div>
  );
}

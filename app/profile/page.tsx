import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut, prisma } from "@/lib/auth";

export const metadata = {
  title: "Mon profil - Cinery",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = user.name ?? "Utilisateur";
  const memberSince = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  const initials = displayName
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Mon profil</h1>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {user.image ? (
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shrink-0">
                <Image
                  src={user.image}
                  alt={displayName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-bold shrink-0">
                {initials}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-neutral-400 mt-1">{user.email}</p>
              <p className="text-sm text-neutral-500 mt-3">
                Membre depuis le {memberSince}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Compte
            </h3>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-red-950 border border-red-900 text-red-300 px-4 py-2 text-sm font-medium hover:bg-red-900 hover:text-white transition-colors"
              >
                Se deconnecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

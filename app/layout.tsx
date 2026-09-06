import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";
import NavLinks from "@/components/NavLinks";
import { auth } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Cinery - Le cinema, sans limites.",
    template: "%s - Cinery",
  },
  description: "Decouvrez, sauvegardez et suivez vos films preferes. Le cinema, sans limites.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-cinery-bg text-cinery-white font-sans antialiased">
        {isLoggedIn && (
          <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-4 bg-cinery-bg/30 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-10 shrink-0">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image src="/logo.png" alt="Cinery" fill sizes="32px" className="object-contain" priority />
                </div>
                <span className="text-xl font-bold tracking-widest text-cinery-white hidden sm:inline">CINERY</span>
              </Link>

              <NavLinks />
            </div>

            <div className="flex-1 max-w-lg">
              <Suspense fallback={<div className="h-10" />}>
                <SearchBar />
              </Suspense>
            </div>

            <UserMenu />
          </header>
        )}

        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinery",
  description: "Le catalogue de films selon vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-black text-white antialiased">
        <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-neutral-800">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-tight hover:text-neutral-300"
            >
              Cinery
            </Link>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <Suspense fallback={<div className="w-full sm:max-w-md h-10" />}>
                <SearchBar />
              </Suspense>
              <UserMenu />
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}

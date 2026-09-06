"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/lists",
    label: "Ma liste",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
        <path d="M6 3h12v18l-6-4-6 4V3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex items-center gap-8">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative flex items-center gap-2 pb-4 -mb-4 pt-1 group"
          >
            <span
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-cinery-accent"
                  : "text-cinery-gray group-hover:text-cinery-white"
              }`}
            >
              {link.icon}
              {link.label}
            </span>
            <span
              className={`absolute left-0 right-0 -bottom-[1px] h-0.5 rounded-full bg-cinery-accent transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

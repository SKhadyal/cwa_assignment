// components/header.tsx
"use client"; // needed if you use hooks or onClick etc.

import Link from "next/link";

type Item = { href: string; label: string };
const navItems: Item[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="p-4 border-b">
      <nav className="flex gap-4">
        {navItems.map((it) => (
          <Link key={it.href} href={it.href}>
            {it.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

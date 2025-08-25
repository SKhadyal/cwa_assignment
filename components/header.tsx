'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [active, setActive] = useState('/');

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname);
  }, [pathname]);

  return (
    <>
      <div className="topbar">
        <h1>Title</h1>
        <div className="student">Sushank Sharma — Student No. 21664359</div>
      </div>

      <div className="navrow" role="navigation" aria-label="Main navigation">
        <nav className="nav-links">
          <Link href="/" aria-current={active==="/" ? 'page':undefined}>Tabs</Link> |
          <Link href="/pre-lab" aria-current={active==="/pre-lab" ? 'page':undefined}>Pre-lab Questions</Link> |
          <Link href="/escape-room" aria-current={active==="/escape-room" ? 'page':undefined}>Escape Room</Link> |
          <Link href="/coding-races" aria-current={active==="/coding-races" ? 'page':undefined}>Coding Races</Link> |
          <Link href="/court-room" aria-current={active==="/court-room" ? 'page':undefined}>Court Room</Link>
        </nav>

        <div className="right-side">
          <Link href="/about" aria-current={active==="/about" ? 'page':undefined}>About</Link>
          <button className="menu-btn" aria-label="Menu">☰</button>
        </div>
      </div>
    </>
  );
}

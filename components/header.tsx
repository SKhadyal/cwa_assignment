'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [active, setActive] = useState('/');
  const [hamOpen, setHamOpen] = useState(false);
  const hamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname) setActive(pathname);
  }, [pathname]);

  // close small dropdown on outside click or Escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!hamRef.current) return;
      if (!hamRef.current.contains(e.target as Node)) setHamOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setHamOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="topbar">
        <h1>Title</h1>
        <div className="student">Sushank Sharma — Student No. 21664359</div>
      </div>

      {/* Inline nav row with pipes on the left; About + burger on the right */}
      <div className="navrow" role="navigation" aria-label="Main navigation">
        <nav className="nav-links">
          <Link href="/" aria-current={active === '/' ? 'page' : undefined}>Tabs</Link> <span>|</span>
          <Link href="/pre-lab" aria-current={active === '/pre-lab' ? 'page' : undefined}>Pre-lab Questions</Link> <span>|</span>
          <Link href="/escape-room" aria-current={active === '/escape-room' ? 'page' : undefined}>Escape Room</Link> <span>|</span>
          <Link href="/coding-races" aria-current={active === '/coding-races' ? 'page' : undefined}>Coding Races</Link> <span>|</span>
          <Link href="/court-room" aria-current={active === '/court-room' ? 'page' : undefined}>Court Room</Link>
        </nav>

        <div className="right-side">
          <Link href="/about" aria-current={active === '/about' ? 'page' : undefined}>About</Link>

          {/* small hamburger with a tiny dropdown panel */}
          <div className="ham" ref={hamRef}>
            <button
              type="button"
              className="menu-btn"
              aria-haspopup="menu"
              aria-expanded={hamOpen}
              aria-label={hamOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setHamOpen(v => !v)}
            >
              ☰
            </button>

            {hamOpen && (
              <div className="ham-panel" role="menu" aria-label="Quick menu">
                <div className="ham-item" role="menuitem" aria-disabled="true">Settings</div>
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

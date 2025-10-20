'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light'|'dark'|null;
    if (saved) setTheme(saved);
    else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:8}}>
      <span>Dark Mode</span>
      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={() => setTheme(theme==='light'?'dark':'light')}
        style={{
          width:48,height:24,border:'2px solid #111',borderRadius:24,position:'relative',
          background: theme==='dark' ? '#111' : '#fff'
        }}
      >
        <span style={{
          position:'absolute',top:2,left:theme==='dark'?24:2,width:18,height:18,
          border:'2px solid #111',borderRadius:'999px',background:'#fff'
        }}/>
      </button>
    </label>
  );
}

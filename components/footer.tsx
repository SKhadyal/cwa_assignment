'use client';
import { useEffect, useState } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <footer>
      © {year} — Sushank Sharma — Student No. 21664359 — {date || '…'}
    </footer>
  );
}

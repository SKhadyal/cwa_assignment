"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.body.setAttribute("data-theme", "dark");
    else document.body.removeAttribute("data-theme");
  }, [dark]);

  return (
    <header>
      <div className="topbar">
        <h1>Title</h1>
        <div className="student">Sushank Sharma — Student No. 21664359</div>
      </div>

      <div className="navrow">
        <div className="nav-links">
          <Link href="/">Tabs</Link>
          <Link href="/pre-lab">Pre-lab Questions</Link>
          <Link href="/escape-room">Escape Room</Link>
          <Link href="/coding-races">Coding Races</Link>
          <Link href="/court-room">Court Room</Link>
          <Link href="/about">About</Link>
        </div>

        <div className="right-side">
          {/* Dark mode switch */}
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="darkSwitch"
              checked={dark}
              onChange={() => setDark(!dark)}
            />
            <label className="form-check-label" htmlFor="darkSwitch">
              Dark Mode
            </label>
          </div>

          {/* Hamburger */}
          <div className="ham">
            <button className="menu-btn" data-bs-toggle="dropdown">
              ☰
            </button>
            <div className="ham-panel dropdown-menu dropdown-menu-end show">
              <div className="ham-item">Settings</div>
              <div className="ham-item">Help</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

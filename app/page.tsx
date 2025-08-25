// app/page.tsx
'use client';
import { useMemo, useState } from 'react';

function generateTabsHTML(names: string[]) {
  const buttons = names.map((n, i) =>
    `<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i===0?'true':'false'}" onclick="selectTab(${i})">${n}</button>`
  ).join('\n    ');

  const panels = names.map((n, i) =>
    `<section role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${i===0?'':'hidden'}>
  <p>${n} content goes here.</p>
</section>`
  ).join('\n\n    ');

  const css = `
  /* Inline CSS for tabs */
  :root { --gap: .5rem; --accent: #2563eb; font-family: system-ui, Arial; }
  body { margin: 1rem; }
  .tabs { max-width: 900px; }
  .tablist { display: flex; gap: var(--gap); margin-bottom: 1rem; flex-wrap: wrap; }
  [role="tab"] { padding: .5rem .75rem; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; border-radius: .375rem; }
  [role="tab"][aria-selected="true"] { outline: 2px solid var(--accent); background: #eef2ff; }
  [role="tabpanel"] { border: 1px solid #cbd5e1; padding: 1rem; border-radius: .375rem; }
  `;

  const js = `
  // simple accessible tab switcher
  function selectTab(i){
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    tabs.forEach((t, idx) => t.setAttribute('aria-selected', String(idx===i)));
    panels.forEach((p, idx) => {
      if (idx===i) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
  }
  `;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Tabs</title>
<style>${css}</style>
</head>
<body>
<div class="tabs">
  <div class="tablist" role="tablist" aria-label="Generated Tabs">
    ${buttons}
  </div>
  ${panels}
</div>
<script>${js}</script>
</body>
</html>`;
}

export default function Home() {
  const [raw, setRaw] = useState('Tab 1, Tab 2, Tab 3');

  const names = useMemo(
    () => raw.split(',').map(s => s.trim()).filter(Boolean),
    [raw]
  );

  const output = useMemo(() => generateTabsHTML(names), [names]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    alert('Copied HTML to clipboard!');
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Hello.html'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h1>HTML + JS Generator (Tabs)</h1>
      <p>Enter tab names (comma-separated). The generated file will work if you save it as <code>Hello.html</code> and open it in a browser.</p>

      <label htmlFor="tabs">Tab names</label><br />
      <input
        id="tabs"
        type="text"
        value={raw}
        onChange={e => setRaw(e.target.value)}
        style={{ width: '100%', padding: '.5rem', margin: '.25rem 0 1rem', maxWidth: 700 }}
      />

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <button onClick={copy}>Copy to Clipboard</button>
        <button onClick={download}>Download Hello.html</button>
      </div>

      <textarea
        readOnly
        rows={18}
        style={{ width: '100%', maxWidth: 900 }}
        value={output}
      />
    </section>
  );
}

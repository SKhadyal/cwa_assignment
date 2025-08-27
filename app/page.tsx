'use client';
import { useMemo, useState } from 'react';

type Tab = { title: string; content: string };

function buildHTML(tabs: Tab[]) {
  const btns = tabs.map((t,i)=>`<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i===0?'true':'false'}" onclick="selectTab(${i})">${t.title}</button>`).join('\n      ');
  const panels = tabs.map((t,i)=>`<section role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${i===0?'':'hidden'}>
  <pre>${t.content.replace(/</g,'&lt;')}</pre>
</section>`).join('\n\n      ');
  const css = `
  /* Inline CSS only (no classes) */
  :root { font-family: system-ui, Arial; }
  body { margin: 16px; }
  [role="tab"] { border: 2px solid #111; padding: 6px 10px; background:#fff; cursor:pointer; border-radius:4px; }
  [role="tab"][aria-selected="true"] { outline: 3px solid #111; }
  [role="tabpanel"] { border: 2px solid #111; padding: 12px; border-radius:4px; margin-top: 12px; }
  `;
  const js = `
  function selectTab(i){
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    tabs.forEach((t,idx)=>t.setAttribute('aria-selected', String(idx===i)));
    panels.forEach((p,idx)=> idx===i ? p.removeAttribute('hidden') : p.setAttribute('hidden',''));
  }
  `;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Tabs</title>
<style>${css}</style></head>
<body>
  <div role="tablist" aria-label="Tabs">
      ${btns}
  </div>
  ${panels}
<script>${js}</script>
</body></html>`;
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { title: 'Step 1', content: 'Step 1:\n1. Do X\n2. Do Y' },
    { title: 'Step 2', content: 'Step 2:\n1. Install VSCode\n2. Install Chrome\n3. Install Node\n4. etc' },
    { title: 'Step 3', content: 'Step 3:\n…' },
  ]);
  const [current, setCurrent] = useState(1);
  const html = useMemo(()=>buildHTML(tabs),[tabs]);

  const addTab = () => setTabs(t=>[...t,{title:`Step ${t.length+1}`,content:`Step ${t.length+1}:\n…`}]);
  const copy = async () => { await navigator.clipboard.writeText(html); alert('Copied! Paste into Hello.html'); };
  const download = () => {
    const blob = new Blob([html], { type:'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'Hello.html'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="grid-2">
      {/* LEFT — Tabs editor */}
      <div className="left">
        <h2>Tabs</h2> 
        <div className="kv">
          <div>
            <label>Tabs Headers:</label>
            <button className="addbtn" onClick={addTab} aria-label="Add tab">[+]</button>
            <div className="tablist" style={{marginTop:'.5rem'}}>
              {tabs.map((t,i)=>(
                <button
                  key={i}
                  aria-selected={current===i}
                  onClick={()=>setCurrent(i)}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Tabs Content</label>
            <div className="box" style={{maxWidth:360}}>
              <textarea
                aria-label="Tab content"
                value={tabs[current]?.content || ''}
                onChange={e=>{
                  const v = e.target.value;
                  setTabs(ts => ts.map((t,idx)=> idx===current?({...t,content:v}):t));
                }}
                rows={10}
                style={{width:'100%',border:'0',outline:'none',resize:'vertical',
                  background:'transparent',color:'inherit',fontFamily:'ui-monospace,Consolas,monospace'}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Output */}
      <div className="right">
        <div className="row">
          <label htmlFor="out">Output</label>
          <div className="btns">
            <button className="btn" onClick={copy}>Copy</button>
            <button className="btn" onClick={download}>Download Hello.html</button>
          </div>
        </div>
        <pre id="out" className="codearea" aria-label="Generated code">{html}</pre>
      </div>
    </section>
  );
}

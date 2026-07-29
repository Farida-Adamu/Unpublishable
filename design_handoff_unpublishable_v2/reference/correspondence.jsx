// Concept A — CORRESPONDENCE: pure literary/editorial minimalism.
// No cards, no boxes, no icons. A flowing, chronological list of letters
// set in one warm serif, separated only by rules. The "letter" idea lives
// in the copy (Dear/sign-offs on the reading page) not in postal props.
const CorrespondenceDirection = ({ view, openEssay, goHome }) => {
  const css = `
    .co-root { --paper:#faf9f5; --ink:#161412; --ink-soft:#6b6660; --accent:#6b6660;
      background: var(--paper); color: var(--ink); min-height: 100vh;
      font-family: "Instrument Serif", serif; }
    .co-shell { max-width: 760px; margin: 0 auto; padding: 0 32px 120px; }
    .co-nav { display: flex; justify-content: space-between; align-items: baseline; padding: 40px 0 24px; }
    .co-word { font-style: italic; font-size: 22px; color: var(--ink); background: none; border: 0; padding: 0; cursor: pointer; }
    .co-nav-r { display: flex; gap: 24px; font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); }
    .co-nav-r a { color: inherit; text-decoration: none; cursor: pointer; }
    .co-nav-r a:hover { color: var(--ink); }
    .co-stand { font-family: "JetBrains Mono", monospace; font-style: normal; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1.3; color: var(--ink); margin: 8px 0 56px; white-space: nowrap; }
    .co-list { }
    .co-item { padding: 22px 0; cursor: pointer; }
    .co-item:first-child { border-top: 0; }
    .co-item .ttl { font-size: 30px; line-height: 1.14; font-weight: 500; margin: 0 0 6px; letter-spacing: -0.012em; color: #0e0d0b; transition: opacity .15s; }
    .co-item:hover .ttl { opacity: 0.6; }
    .co-item .dek { font-style: normal; font-size: 15px; line-height: 1.45; color: var(--ink-soft); margin: 0 0 8px; max-width: 60ch; }
    .co-item .more { display: flex; align-items: baseline; gap: 10px; font-family: "JetBrains Mono", monospace; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

    .co-essay { max-width: 640px; }
    .co-back { background: none; border: 0; padding: 40px 0 0; cursor: pointer; font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); }
    .co-back:hover { color: var(--ink); }
    .co-essay-date { font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); margin: 40px 0 24px; }
    .co-essay-title { font-size: clamp(36px, 5vw, 54px); font-weight: 500; line-height: 1.08; letter-spacing: -0.015em; margin: 0 0 40px; color: #0e0d0b; }
    .co-essay-body p { font-size: 21px; line-height: 1.65; margin: 0 0 1.3em; }
    .co-signoff { margin-top: 44px; font-style: italic; font-size: 20px; line-height: 1.5; white-space: pre-line; color: var(--ink); }
    .co-end { margin-top: 64px; padding-top: 20px; font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); display: flex; justify-content: space-between; }
    .co-end a { cursor: pointer; color: var(--ink); text-decoration: none; }
  `;

  const signoff = "Yours, still logged in —\nThe Editor";

  if (view.mode === "essay") {
    const idx = window.ESSAYS.findIndex(e => e.n === view.n);
    const essay = window.ESSAYS[idx] || window.ESSAYS[0];
    const next = window.ESSAYS[(idx + 1) % window.ESSAYS.length];
    return (
      <div className="co-root">
        <style>{css}</style>
        <div className="co-shell co-essay">
          <button className="co-back" onClick={goHome}>← Back</button>
          <div className="co-essay-date">{essay.date}</div>
          <h1 className="co-essay-title">{essay.title}</h1>
          <div className="co-essay-body">{essay.body.map((p,i) => <p key={i}>{p}</p>)}</div>
          <p className="co-signoff">{signoff}</p>
          <div className="co-end"><span>Sent {essay.date}</span><a onClick={() => openEssay(next.n)}>Next letter → {next.title}</a></div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-root">
      <style>{css}</style>
      <div className="co-shell">
        <nav className="co-nav">
          <button className="co-word" onClick={goHome}>unpublishable</button>
          <div className="co-nav-r"><a>Archive</a><a>About</a><a>Subscribe</a></div>
        </nav>
        <p className="co-stand">Letters about a changing world.</p>
        <section className="co-list">
          {window.ESSAYS.map(e => (
            <article key={e.n} className="co-item" onClick={() => openEssay(e.n)}>
              <h2 className="ttl">{e.title}</h2>
              <p className="dek">{e.dek}</p>
              <div className="more"><span>{e.date}</span></div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};
window.CorrespondenceDirection = CorrespondenceDirection;

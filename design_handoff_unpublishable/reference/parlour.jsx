// Direction: PARLOUR — pastel cards, playful color contrast.
// Numbered tiles, LCD-style digits, monospace category labels, abstract art.
const { useState: pluseState, useEffect: pluseEffect, useRef: pluseRef } = React;

// Category → consistent card style. Pop Culture = blue, Technology = mint, etc.
const CATEGORY_STYLES = {
  "POP CULTURE": { bg: "#dde4f0", artInk: "#2c4ab8", art: "halftone" },  // soft blue + ink blue
  "TECHNOLOGY":  { bg: "#cfdfd1", artInk: "#2a4a3c", art: "signal"   },  // mint + forest
  "IDENTITY":    { bg: "#e9ddc4", artInk: "#c14a1f", art: "wave"     },  // sand + clay
  "MEDIA":       { bg: "#d4ddc0", artInk: "#7a2e2e", art: "pill"     },  // sage + brick
  "BODY":        { bg: "#e0d2d8", artInk: "#5a3b8a", art: "grid"     },  // dusty rose + plum
  "LANGUAGE":    { bg: "#d8d2bf", artInk: "#1e3d8f", art: "letters"  },  // sand + ink blue
  "CULTURE":     { bg: "#e6d6c2", artInk: "#1a1a1a", art: "cassette" },  // peach + black
};

const styleFor = (cat) => CATEGORY_STYLES[cat] || CATEGORY_STYLES["POP CULTURE"];

// "01" → "1.0", "08" → "8.0"
const formatNumber = (n) => `${parseInt(n, 10)}.0`;

// Artwork renderer (shared between hero, cards, essay page)
const Artwork = ({ kind, ink }) => {
  switch (kind) {
    case "hero": return (
      <div className="art-hero">
        <div className="bar bar1"></div>
        <div className="ring1"></div>
        <div className="ring2"></div>
        <div className="ring3"></div>
        <div className="square sq1"></div>
        <div className="square sq2"></div>
        <div className="tri"></div>
        <div className="bar bar2"></div>
      </div>
    );
    case "halftone": return (
      <div className="art art-halftone">
        <div className="a a1"></div><div className="a a2"></div><div className="a a3"></div>
      </div>
    );
    case "stack": return (
      <div className="art art-stack">
        <div className="a a1"></div><div className="a a2"></div><div className="a a3"></div><div className="a a4"></div>
      </div>
    );
    case "wave": return (
      <div className="art art-wave">
        <svg viewBox="0 0 200 160" preserveAspectRatio="none">
          {[20,40,60,80,100].map((r, i) => (
            <circle key={i} cx="100" cy="160" r={r * 1.4} fill="none" stroke={ink} strokeWidth="2" opacity={1 - i * 0.16} />
          ))}
          <circle cx="100" cy="160" r="14" fill={ink} />
        </svg>
      </div>
    );
    case "pill": return (
      <div className="art art-pill">
        <div className="a a1"></div><div className="a a2"></div>
      </div>
    );
    case "grid": return (
      <div className="art art-grid"><div className="a a1"></div></div>
    );
    case "letters": return (
      <div className="art art-letters"><span className="a">aa</span></div>
    );
    case "cassette": return (
      <div className="art art-cassette">
        <div className="a strip s1"></div>
        <div className="a strip s2"></div>
        <div className="a strip s3"></div>
        <div className="a reel r1"></div>
        <div className="a reel r2"></div>
      </div>
    );
    case "signal": return (
      <div className="art art-signal">
        <svg viewBox="0 0 200 160" preserveAspectRatio="none">
          <g transform="translate(100 130)">
            {[20, 50, 80, 110, 140].map((r, i) => (
              <path key={i}
                d={`M ${-r * 0.95} 0 A ${r} ${r} 0 0 1 ${r * 0.95} 0`}
                fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round"
                opacity={1 - i * 0.16}
              />
            ))}
            <circle cx="0" cy="0" r="9" fill={ink} />
          </g>
        </svg>
      </div>
    );
    default: return null;
  }
};

const ParlourDirection = ({ view, openEssay, goHome }) => {
  const [scrolled, setScrolled] = pluseState(false);

  pluseEffect(() => {
    if (view.mode !== "home") { setScrolled(false); return; }
    const onScroll = () => setScrolled(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [view.mode]);

  const css = `
    .pl-root {
      --paper: #d9d8c2;
      --paper-soft: #e3e1cb;
      --ink: #2a261e;
      --ink-soft: #6b6458;
      --rule: #2a261e;
      background:
        radial-gradient(120% 80% at 50% 0%, #c8d4c0 0%, #d4d2b8 38%, #c2b896 80%, #a89876 100%);
      background-attachment: fixed;
      color: var(--ink);
      min-height: 100vh;
      font-family: "Space Grotesk", system-ui, sans-serif;
      padding: 14px;
    }
    .pl-frame {
      background: var(--paper);
      border: 1.5px solid var(--rule);
      min-height: calc(100vh - 28px);
      padding: 0 24px 24px;
      position: relative;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.04);
    }

    /* Nav — sticky, becomes opaque on scroll. Wordmark fades in. */
    .pl-nav {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 0 10px;
      margin: 0;
      background: var(--paper);
    }
    .pl-nav-wordmark {
      font-family: "Major Mono Display", monospace;
      font-size: 18px;
      letter-spacing: 0.04em;
      text-transform: lowercase;
      color: var(--ink);
      background: none; border: 0; padding: 0; cursor: pointer;
      opacity: 0; transform: translateY(-4px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
    }
    .pl-nav.is-scrolled .pl-nav-wordmark {
      opacity: 1; transform: translateY(0); pointer-events: auto;
    }
    .pl-nav-r {
      display: flex; gap: 28px;
      font-family: "JetBrains Mono", monospace;
      font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
      margin-left: auto;
    }
    .pl-nav-r a { color: var(--ink); text-decoration: none; cursor: pointer; padding: 4px 0; border-bottom: 1px solid transparent; }
    .pl-nav-r a:hover { border-bottom-color: var(--ink); }

    /* Hero — wordmark + tagline beneath, left-aligned, block-level */
    .pl-hero {
      padding: 8px 0 4px;
      margin: 0;
    }
    .pl-hero .word {
      display: block;
      font-family: "Major Mono Display", monospace;
      font-size: clamp(80px, 13vw, 200px);
      line-height: 0.86;
      letter-spacing: -0.01em;
      margin: 0 0 12px;
      color: var(--ink);
      text-transform: lowercase;
    }
    .pl-tagline {
      display: block;
      font-family: "Instrument Serif", serif;
      font-style: italic;
      font-size: clamp(22px, 2.2vw, 28px);
      line-height: 1.3;
      letter-spacing: -0.005em;
      margin: 0 0 16px;
      padding: 0;
      color: var(--ink);
      max-width: 600px;
      width: 100%;
      text-align: left;
    }

    /* ---------------- GRIDS ---------------- */
    .pl-grid-top {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }
    .pl-grid-bottom {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    /* Base card */
    .pl-card {
      background: var(--card-bg);
      border: 1.5px solid var(--rule);
      padding: 16px 16px 14px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: flex; flex-direction: column;
      transition: transform 0.25s cubic-bezier(.2,.7,.2,1), box-shadow 0.25s;
    }
    .pl-card:hover {
      transform: translate(-3px, -3px);
      box-shadow: 5px 5px 0 var(--ink);
    }
    .pl-card .cat {
      font-family: "JetBrains Mono", monospace;
      font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--ink);
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .pl-card .cat .n {
      color: var(--ink-soft);
      font-size: 10.5px;
      letter-spacing: 0.16em;
    }
    .pl-card .ttl {
      font-family: "Instrument Serif", serif;
      font-weight: 400;
      letter-spacing: -0.012em;
      margin: 14px 0 8px;
      color: var(--ink);
      text-wrap: balance;
    }
    .pl-card .meta {
      font-family: "JetBrains Mono", monospace;
      font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--ink-soft);
      display: flex; gap: 14px; align-items: center;
      margin-bottom: 14px;
    }
    .pl-card .meta .sep {
      width: 3px; height: 3px; border-radius: 50%;
      background: var(--ink-soft);
      flex: none;
    }
    .pl-card .img {
      margin: auto -16px 0;
      flex: 1;
      min-height: 120px;
      border-top: 1.5px solid var(--rule);
      background: var(--card-bg);
      position: relative;
      overflow: hidden;
    }
    .pl-card .img::after {
      content: "";
      position: absolute; inset: 0;
      background-image: radial-gradient(rgba(20,20,20,0.07) 0.7px, transparent 0.9px);
      background-size: 3px 3px;
      mix-blend-mode: multiply;
      pointer-events: none;
    }
    .pl-card .read {
      position: absolute; right: 14px; bottom: 14px;
      font-family: "JetBrains Mono", monospace;
      font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--ink);
      background: var(--paper);
      border: 1.5px solid var(--ink);
      padding: 6px 10px;
      display: inline-flex; align-items: center; gap: 8px;
      z-index: 2;
      transition: background 0.15s, color 0.15s;
    }
    .pl-card .read .arr { transition: transform 0.2s ease; }
    .pl-card:hover .read { background: var(--ink); color: var(--paper); }
    .pl-card:hover .read .arr { transform: translateX(3px); }

    /* HERO card — spans 2x2, big number small, BIG title */
    .pl-hero-card {
      grid-column: 1 / 3;
      grid-row: 1 / 3;
      padding: 22px 24px 22px;
      --card-bg: #b8c8e6;
      --art-ink: #1a2f8a;
    }
    .pl-hero-card .ttl {
      font-size: clamp(40px, 4.4vw, 68px);
      line-height: 1.0;
      margin: 18px 0 12px;
    }
    .pl-hero-card .dek {
      font-family: "Instrument Serif", serif;
      font-style: italic;
      font-size: 20px;
      line-height: 1.4;
      color: var(--ink);
      max-width: 38ch;
      margin: 0 0 16px;
    }
    .pl-hero-card .img { min-height: 240px; }

    /* Regular card — title is the dominant element */
    .pl-card-regular .ttl {
      font-size: 26px;
      line-height: 1.05;
    }
    .pl-card-regular { min-height: 320px; }

    /* Bottom-row cards a touch shorter to keep visual balance */
    .pl-grid-bottom .pl-card { min-height: 320px; }

    /* ---------------- Artwork ---------------- */
    .art { position: absolute; inset: 0; }

    /* Hero illustration — bold high-contrast geometry */
    .art-hero { position: absolute; inset: 0; overflow: hidden; }
    .art-hero .ring1 {
      position: absolute;
      width: 70%; aspect-ratio: 1;
      left: 15%; top: 14%;
      border-radius: 50%;
      background: var(--art-ink);
    }
    .art-hero .ring2 {
      position: absolute;
      width: 42%; aspect-ratio: 1;
      left: 29%; top: 28%;
      border-radius: 50%;
      background: var(--card-bg);
    }
    .art-hero .ring3 {
      position: absolute;
      width: 20%; aspect-ratio: 1;
      left: 40%; top: 39%;
      border-radius: 50%;
      background: var(--art-ink);
    }
    .art-hero .bar {
      position: absolute;
      left: 0; right: 0;
      height: 14px;
      background: var(--art-ink);
    }
    .art-hero .bar1 { top: 6%; }
    .art-hero .bar2 { bottom: 8%; }
    .art-hero .square {
      position: absolute;
      background: var(--card-bg);
      border: 4px solid var(--art-ink);
    }
    .art-hero .sq1 { left: 5%; bottom: 18%; width: 70px; height: 70px; transform: rotate(12deg); }
    .art-hero .sq2 { right: 6%; top: 22%; width: 50px; height: 50px; transform: rotate(-10deg); background: var(--art-ink); border: 0; }
    .art-hero .tri {
      position: absolute;
      right: 10%; bottom: 22%;
      width: 0; height: 0;
      border-left: 38px solid transparent;
      border-right: 38px solid transparent;
      border-bottom: 60px solid var(--art-ink);
      transform: rotate(8deg);
    }

    .art-halftone .a { position: absolute; border-radius: 50%; }
    .art-halftone .a1 { width: 70%; height: 130%; left: -10%; top: -15%; background: var(--art-ink); opacity: 0.9; }
    .art-halftone .a2 { width: 60%; height: 100%; right: -20%; bottom: -30%; background: var(--art-ink); opacity: 0.5; mix-blend-mode: multiply; }
    .art-halftone .a3 { width: 24px; height: 24px; left: 60%; top: 30%; background: var(--card-bg); opacity: 0.9; }

    .art-stack .a { position: absolute; background: var(--art-ink); }
    .art-stack .a1 { left: 12%; top: 14%; width: 76%; height: 12%; opacity: 1; }
    .art-stack .a2 { left: 22%; top: 32%; width: 56%; height: 12%; opacity: 0.8; }
    .art-stack .a3 { left: 14%; top: 50%; width: 70%; height: 12%; opacity: 0.6; }
    .art-stack .a4 { left: 28%; top: 68%; width: 44%; height: 12%; opacity: 0.4; }

    .art-wave svg { position: absolute; inset: 0; width: 100%; height: 100%; }

    .art-pill .a { position: absolute; border-radius: 999px; }
    .art-pill .a1 { width: 120%; height: 50%; left: -10%; top: 25%; background: var(--art-ink); }
    .art-pill .a2 { width: 50%; height: 50%; left: 25%; top: 25%; background: var(--card-bg); opacity: 0.6; border-radius: 999px; }

    .art-grid {
      background-image: radial-gradient(var(--art-ink) 24%, transparent 26%);
      background-size: 18px 18px;
      background-position: 4px 4px;
    }
    .art-grid .a { position: absolute; background: var(--art-ink); }
    .art-grid .a1 { left: 40%; top: 30%; width: 36%; height: 36%; mix-blend-mode: multiply; opacity: 0.55; }

    .art-letters { display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .art-letters .a {
      font-family: "Fraunces", serif;
      font-style: italic;
      font-size: 180px;
      line-height: 1;
      color: var(--art-ink);
      font-weight: 400;
      letter-spacing: -0.05em;
      transform: rotate(-6deg);
      user-select: none;
    }

    .art-cassette .a { position: absolute; }
    .art-cassette .strip { left: 0; right: 0; height: 14%; background: var(--art-ink); }
    .art-cassette .s1 { top: 22%; }
    .art-cassette .s2 { top: 42%; opacity: 0.5; }
    .art-cassette .s3 { top: 62%; }
    .art-cassette .reel { width: 38px; height: 38px; border-radius: 50%; background: var(--card-bg); border: 4px solid var(--art-ink); top: 32%; }
    .art-cassette .r1 { left: 18%; }
    .art-cassette .r2 { right: 18%; }

    .art-signal svg { position: absolute; inset: 0; width: 100%; height: 100%; }

    /* ---------------- Essay page ---------------- */
    .pl-essay { max-width: 720px; margin: 0 auto; padding: 16px 32px 96px; }
    .pl-back {
      background: none; border: 1.5px solid var(--rule); padding: 6px 12px;
      font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--ink); cursor: pointer;
    }
    .pl-back:hover { background: var(--ink); color: var(--paper); }
    .pl-essay-hdr {
      margin-top: 40px;
      display: grid; grid-template-columns: auto 1fr; gap: 28px;
      align-items: end;
      padding-bottom: 24px; border-bottom: 1.5px solid var(--rule);
    }
    .pl-essay-num {
      font-family: "Major Mono Display", monospace;
      font-size: clamp(80px, 11vw, 140px);
      line-height: 0.86;
      margin: 0;
      color: var(--ink);
      font-weight: 400;
    }
    .pl-essay-meta-top {
      padding-bottom: 8px;
      font-family: "JetBrains Mono", monospace;
      font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    }
    .pl-essay-meta-top div { padding: 4px 0; }
    .pl-essay-meta-top b { color: var(--ink-soft); font-weight: 400; margin-right: 10px; }
    .pl-essay-title {
      font-family: "Instrument Serif", serif;
      font-size: clamp(40px, 5.4vw, 64px);
      font-weight: 400;
      line-height: 1.04; letter-spacing: -0.02em;
      margin: 28px 0 18px;
    }
    .pl-essay-title em { font-style: normal; color: inherit; }
    .pl-essay-dek {
      font-family: "Instrument Serif", serif;
      font-style: italic;
      font-size: 21px; line-height: 1.45;
      color: var(--ink-soft);
      max-width: 36ch;
      margin: 0 0 36px;
    }
    .pl-essay-img {
      height: 280px;
      border: 1.5px solid var(--rule);
      background: var(--card-bg);
      position: relative;
      overflow: hidden;
      margin-bottom: 40px;
    }
    .pl-essay-body p {
      font-family: "Instrument Serif", serif;
      font-size: 21px; line-height: 1.55;
      margin: 0 0 1.2em;
      color: var(--ink);
    }
    .pl-essay-body p:first-of-type::first-letter {
      font-family: "Major Mono Display", monospace;
      float: left; font-size: 72px; line-height: 0.9;
      padding: 6px 14px 0 0; color: var(--art-ink);
    }
    .pl-essay-end {
      margin-top: 56px; padding-top: 20px; border-top: 1.5px solid var(--rule);
      display: flex; justify-content: space-between; align-items: center; gap: 24px;
      font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    }
    .pl-essay-end .next { background: var(--ink); color: var(--paper); padding: 10px 14px; cursor: pointer; border: 0; }
    .pl-essay-end .next:hover { background: var(--art-ink); }
  `;

  // ESSAY PAGE
  if (view.mode === "essay") {
    const idx = window.ESSAYS.findIndex(e => e.n === view.n);
    const essay = window.ESSAYS[idx] || window.ESSAYS[0];
    const tile = styleFor(essay.category);
    const next = window.ESSAYS[(idx + 1) % window.ESSAYS.length];
    return (
      <div className="pl-root" style={{ "--card-bg": tile.bg, "--art-ink": tile.artInk }}>
        <style>{css}</style>
        <div className="pl-frame">
          <nav className="pl-nav is-scrolled">
            <button className="pl-nav-wordmark" onClick={goHome}>unpublishable</button>
            <div className="pl-nav-r"><a>Archive</a><a>About</a><a>Subscribe ↗</a></div>
          </nav>
          <article className="pl-essay">
            <button className="pl-back" onClick={goHome}>← Back to index</button>
            <header className="pl-essay-hdr">
              <div className="pl-essay-num">{formatNumber(essay.n)}</div>
              <div className="pl-essay-meta-top">
                <div><b>Cat.</b>{essay.category}</div>
                <div><b>Filed</b>{essay.date}</div>
                <div><b>Read</b>{essay.read}</div>
              </div>
            </header>
            <h1 className="pl-essay-title">{essay.title}</h1>
            <p className="pl-essay-dek">{essay.dek}</p>
            <div className="pl-essay-img">
              <Artwork kind={tile.art} ink={tile.artInk} />
            </div>
            <div className="pl-essay-body">
              {essay.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="pl-essay-end">
              <span>— End № {essay.n}</span>
              <button className="next" onClick={() => openEssay(next.n)}>Next → {next.title}</button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // HOMEPAGE
  const essays = window.ESSAYS;
  const hero = essays[0];
  const heroTile = styleFor(hero.category);
  // After hero: 4 cards in the top-right 2x2, then 3 cards below.
  const topRest   = essays.slice(1, 5); // essays 2-5
  const bottomRow = essays.slice(5, 8); // essays 6-8

  const renderCard = (e, extraClass = "") => {
    const tile = styleFor(e.category);
    return (
      <article
        key={e.n}
        className={`pl-card pl-card-regular ${extraClass}`}
        style={{ "--card-bg": tile.bg, "--art-ink": tile.artInk }}
        onClick={() => openEssay(e.n)}
      >
        <div className="cat">
          <span>{e.category}</span>
          <span className="n">{formatNumber(e.n)}</span>
        </div>
        <h3 className="ttl">{e.title}</h3>
        <div className="meta">
          <span>{e.date}</span>
          <span className="sep"></span>
          <span>{e.read}</span>
        </div>
        <div className="img">
          <Artwork kind={tile.art} ink={tile.artInk} />
        </div>
        <span className="read">Read <span className="arr">→</span></span>
      </article>
    );
  };

  return (
    <div className="pl-root">
      <style>{css}</style>
      <div className="pl-frame">
        <nav className={`pl-nav ${scrolled ? "is-scrolled" : ""}`}>
          <button className="pl-nav-wordmark" onClick={goHome}>unpublishable</button>
          <div className="pl-nav-r">
            <a>Archive</a><a>About</a><a>Subscribe ↗</a>
          </div>
        </nav>

        <section className="pl-hero">
          <h1 className="word">unpub<br/>lishable</h1>
        </section>
        <p className="pl-tagline">
          Essays on pop modernism, technology &amp; the changing world around
          it.
        </p>

        {/* Top: hero (2×2) + 4 regular cards */}
        <section className="pl-grid-top">
          <article
            className="pl-card pl-hero-card"
            onClick={() => openEssay(hero.n)}
          >
            <div className="cat">
              <span>{hero.category}</span>
              <span className="n">{formatNumber(hero.n)} · Featured</span>
            </div>
            <h2 className="ttl">{hero.title}</h2>
            <p className="dek">{hero.dek}</p>
            <div className="meta">
              <span>{hero.date}</span>
              <span className="sep"></span>
              <span>{hero.read}</span>
            </div>
            <div className="img">
              <Artwork kind="hero" ink="#1a2f8a" />
            </div>
            <span className="read">Read <span className="arr">→</span></span>
          </article>

          {topRest.map(e => renderCard(e))}
        </section>

        {/* Bottom: 3 across */}
        <section className="pl-grid-bottom">
          {bottomRow.map(e => renderCard(e))}
        </section>
      </div>
    </div>
  );
};

window.ParlourDirection = ParlourDirection;

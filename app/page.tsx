"use client";

import { FormEvent, useMemo, useState } from "react";

const offlineReplies = [
  "Der Alpenempfang ist gerade weg. In Wanheimerort hätten wir das WLAN einmal böse angeguckt.",
  "Produktivität ist auch nur Gruppenzwang mit Kalender.",
  "Unter 170 BPM ist das für mich ein Podcast.",
  "Ich bin kein Auswanderer. Ich bin Duisburger mit Alpenanschluss.",
  "Hier heißt dat Grüezi. In Duisburg reicht Kopfnicken.",
];

const chatModes = ["Normal verklatscht", "Duisburger Direktheit", "Schweizer Anpassungsversuch", "Gabber-Eskalation", "Kurz vorm Einschlafen"];

const ranks = [
  [0, "Gelegenheitsschläfer"],
  [5, "Kissenbeauftragter"],
  [8, "REM-Raver"],
  [11, "Großmeister des Wegnickens"],
  [14, "Endgegner der Produktivität"],
] as const;

export default function Home() {
  const [active, setActive] = useState("couch");
  const [vibe, setVibe] = useState(42);
  const [sleep, setSleep] = useState(9.5);
  const [trackUrl, setTrackUrl] = useState("https://soundcloud.com/angerfistofficial");
  const [playerUrl, setPlayerUrl] = useState("https://soundcloud.com/angerfistofficial");
  const [message, setMessage] = useState("");
  const [chatMode, setChatMode] = useState(chatModes[0]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chat, setChat] = useState([
    { who: "hanf", text: "Grüezi aus der Schweiz – aber mach dir nix vor: innerlich steh ich immer noch in Wanheimerort an der Haltestelle." },
  ]);

  const rank = useMemo(
    () => [...ranks].reverse().find(([hours]) => sleep >= hours)?.[1] ?? ranks[0][1],
    [sleep],
  );

  function submitTrack(event: FormEvent) {
    event.preventDefault();
    if (/^https?:\/\/(www\.)?soundcloud\.com\//i.test(trackUrl.trim())) setPlayerUrl(trackUrl.trim());
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || chatLoading) return;
    const nextChat = [...chat, { who: "you", text }];
    setChat(nextChat);
    setMessage("");
    setChatLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: chatMode, messages: nextChat.slice(-12) }),
      });
      if (!response.ok) throw new Error("Chat nicht erreichbar");
      const data = await response.json();
      setChat((items) => [...items, { who: "hanf", text: data.reply }]);
    } catch {
      const reply = offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
      setChat((items) => [...items, { who: "hanf", text: reply }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="app-shell" style={{ "--vibe": `${vibe}%` } as React.CSSProperties}>
      <div className="noise" />
      <header className="topbar">
        <button className="brand" onClick={() => setActive("couch")} aria-label="Zur Couch-Zentrale">
          <span className="brand-leaf">☘</span>
          <span><b>COUCHCORE</b><small>Hanfblättchens Parallelwelt</small></span>
        </button>
        <div className="live-pill"><i /> COUCH ONLINE</div>
        <button className="avatar" onClick={() => setActive("chat")} aria-label="Hanfblättchen öffnen">H</button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">SENDUNG 04 · IRGENDWO ZWISCHEN FREITAG UND MONTAG</p>
          <h1>Willkommen zurück,<br/><em>Hanfblättchen.</em></h1>
          <p className="intro">Die Couch hat dich vermisst. Das Hanfblättchen behauptet das Gegenteil, aber es hat dreimal aus der Schweiz angerufen.</p>
        </div>
        <div className="vibe-card">
          <div className="vibe-head"><span>HEUTIGER VIBE</span><strong>{vibe}%</strong></div>
          <input aria-label="Vibe-Level" type="range" min="0" max="100" value={vibe} onChange={(e) => setVibe(Number(e.target.value))}/>
          <div className="vibe-labels"><span>ZIVILISIERT</span><b>SEHR VERDÄCHTIG</b><span>DIMENSION 7</span></div>
        </div>
      </section>

      <nav className="room-nav" aria-label="Bereiche">
        {[["couch","⌂","Couch-Zentrale"],["dj","♫","DJ Couchlock"],["chat","◉","Hanfblatt-Chat"],["sleep","☾","Schlaf-O-Meter"]].map(([id, icon, label]) =>
          <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><span>{icon}</span>{label}</button>
        )}
      </nav>

      {active === "couch" && <section className="dashboard">
        <article className="scene-card">
          <div className="poster">NO<br/>SLEEP<br/><span>JUST<br/>BASS</span></div>
          <div className="lamp"><i/><b/></div>
          <div className="plant">☘<small>☘</small></div>
          <button className="couch" onClick={() => setActive("sleep")} aria-label="Schlafbereich öffnen"><i/><span/><b/></button>
          <div className="hardi"><div className="head">⌁</div><div className="body">H</div><div className="speech">„Ich ruhe nicht.<br/>Ich lade.“</div></div>
          <div className="rug" />
          <button className="record-player" onClick={() => setActive("dj")} aria-label="DJ öffnen"><i/><span/></button>
        </article>
        <div className="side-stack">
          <article className="episode-card"><span>HEUTIGE FOLGE</span><b>EP. 14</b><h2>Der verschwundene Grinder</h2><p>Das Hanfblättchen beschuldigt den Staubsauger. Der Staubsauger fordert einen Anwalt.</p><button onClick={() => setActive("chat")}>FOLGE STARTEN →</button></article>
          <article className="stats-card"><div><span>LETZTER SCHLAF</span><strong>{sleep.toFixed(1)}h</strong><small>{rank}</small></div><div><span>COUCH-STREAK</span><strong>12</strong><small>Tage konsequent</small></div></article>
        </div>
      </section>}

      {active === "dj" && <section className="feature-grid">
        <article className="dj-card hanf-stage">
          <div className="hanf-dancer-wrap">
            <video
              className="hanf-dancer"
              src="/assets/schweizer-hanfblaettchen-dance.mp4"
              poster="/assets/schweizer-hanfblaettchen.png"
              aria-label="Das Schweizer Hanfblättchen tanzt vor einem psychedelischen Hintergrund"
              autoPlay
              loop
              muted
              playsInline
            />
            <span className="bass-shadow" />
          </div>
          <div className="visualizer" aria-hidden="true">{Array.from({length: 38}).map((_,i)=><i key={i} style={{animationDelay:`-${(i%9)*.13}s`,height:`${20+((i*37)%78)}%`}}/>)}</div>
          <div className="dj-title"><span>LIVE AUS DEM WOHNZIMMER</span><h2>DJ HANFBLÄTTCHEN</h2><p>„Unter 170 BPM ist das für mich ein Hörbuch.“</p></div>
          <iframe title="SoundCloud Player" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playerUrl)}&color=%23b7ff00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`} />
        </article>
        <article className="control-card"><p className="eyebrow">FÜTTERE DIE LAVALAMPE</p><h2>SoundCloud-Link rein.</h2><p>Track, Set oder Profil einfügen. Das Hanfblättchen übernimmt keine Haftung für Übergänge.</p><form onSubmit={submitTrack}><input value={trackUrl} onChange={e=>setTrackUrl(e.target.value)} aria-label="SoundCloud-Link"/><button>AUFLEGEN</button></form><div className="warning">⚠ Echte Frequenzanalyse folgt später für eigene Audiodateien. Dieser Visualizer tanzt vorerst nach Gefühl – wie ein Duisburger mit Alpenanschluss.</div></article>
      </section>}

      {active === "chat" && <section className="chat-layout">
        <article className="character-card"><div className="portrait hanf-portrait"><video src="/assets/hanfblaettchen-chat.mp4" poster="/assets/schweizer-hanfblaettchen.png" aria-label="Das Schweizer Hanfblättchen schaut aus seinem psychedelischen Chatfenster" autoPlay loop muted playsInline /></div><p className="eyebrow">ORIGINAL WANHEIMERORT · MIT ALPENANSCHLUSS</p><h2>SCHWEIZER HANFBLÄTTCHEN</h2><p>Duisburger Original, Wahl-Schweizer, Gabber-Fachkraft und Feind jeder frühen Uhrzeit.</p><div className="mood">LAUNE: <b>{chatMode.toUpperCase()}</b></div></article>
        <article className="chat-card">
          <div className="mode-picker" aria-label="Chat-Stimmung">{chatModes.map(mode => <button type="button" key={mode} className={chatMode === mode ? "active" : ""} onClick={() => setChatMode(mode)}>{mode}</button>)}</div>
          <div className="messages">{chat.map((item,i)=><div key={i} className={`message ${item.who}`}><b>{item.who === "hanf" ? "HANFBLÄTTCHEN" : "DU"}</b>{item.text}</div>)}{chatLoading && <div className="message hanf thinking"><b>HANFBLÄTTCHEN</b>Denkt kurz nach … oder ist eingeschlafen.</div>}</div>
          <form onSubmit={sendMessage}><input aria-label="Nachricht an das Hanfblättchen" placeholder="Sag etwas Unkluges …" value={message} onChange={e=>setMessage(e.target.value)}/><button disabled={chatLoading} aria-label="Nachricht senden">↗</button></form>
        </article>
      </section>}

      {active === "sleep" && <section className="sleep-layout">
        <article className="sleep-main"><p className="eyebrow">DAS OFFIZIELLE NICHTSTUN-PROTOKOLL</p><h2>{sleep.toFixed(1)} Stunden</h2><input type="range" min="0" max="18" step="0.5" value={sleep} onChange={e=>setSleep(Number(e.target.value))}/><div className="moon">☾<span>zZ</span></div><h3>{rank}</h3><p>Das Hanfblättchen ist {sleep >= 8 ? "widerwillig beeindruckt" : "enttäuscht von deinem Ehrgeiz"}.</p></article>
        <article className="rank-card"><p className="eyebrow">COUCH-KARRIERE</p>{ranks.map(([hours,name])=><div className={sleep>=hours?"unlocked":""} key={name}><i>{sleep>=hours?"✓":"·"}</i><span><b>{name}</b><small>ab {hours} Stunden</small></span></div>)}</article>
      </section>}

      <footer><span>COUCHCORE v0.1</span><b>Bitte nicht während wichtiger Termine öffnen.</b><span>MADE WITH BASS & BAD IDEAS</span></footer>
    </main>
  );
}

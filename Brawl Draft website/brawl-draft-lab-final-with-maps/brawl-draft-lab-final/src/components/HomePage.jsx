import React from "react";

const featureCards = [
  {
    title: "Map-aware picks",
    description:
      "Every suggestion is tied to the selected map, not a stale one-size-fits-all tier list.",
  },
  {
    title: "Live draft flow",
    description:
      "Track bans, your side of the draft, and recommendations without breaking your pace mid-queue.",
  },
  {
    title: "Fast or deep reads",
    description:
      "Use short blurbs when you need speed, or switch on advanced reasoning for clearer role context.",
  },
];

const steps = [
  "Choose the correct mode, map, and whether your team has first or last pick.",
  "Log the six bans as they happen so the pool stays accurate.",
  "Confirm each pick in order and let the recommendation panel update after every lock-in.",
  "Use the top suggestion cards when you want the safest option, or search manually when you already know the pick.",
];

export function HomePage({ onStartDraft }) {
  return (
    <main className="app-main">
      <section className="hero panel">
        <div className="hero-copy">
          <span className="eyebrow">Draft With More Context</span>
          <h1>Walk into the draft with a cleaner board, calmer reads, and picks that actually make sense.</h1>
          <p>
            Brawl Draft Lab is a fast companion for Brawl Stars drafting. It keeps the map visible, the
            draft order clear, and the best available picks easy to scan while the room is moving.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={onStartDraft}>
              Open Draft Simulator
            </button>
            <span className="secondary-note">Built for ranked, scrims, and fast mid-match decisions.</span>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-value">18</span>
            <span className="metric-label">Canonical maps wired to local assets</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">97</span>
            <span className="metric-label">Brawler portraits available in the local build</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">3</span>
            <span className="metric-label">Product areas: Home, Draft Simulator, About</span>
          </div>
        </div>
      </section>

      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Why It Feels Better</span>
            <h2>Polished around actual draft decisions.</h2>
          </div>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">How To Use It</span>
            <h2>Stay quick during the draft.</h2>
          </div>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step} className="step-card">
              <span className="step-index">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

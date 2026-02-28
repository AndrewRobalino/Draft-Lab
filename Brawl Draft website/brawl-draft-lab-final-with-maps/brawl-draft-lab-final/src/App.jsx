import React, { useState } from "react";
import { AboutPage } from "./components/AboutPage";
import { BestCompPage } from "./components/BestCompPage";
import { DraftSimulator } from "./components/DraftSimulator";
import { HomePage } from "./components/HomePage";

const PAGES = [
  { id: "home", label: "Home" },
  { id: "draft", label: "Draft Simulator" },
  { id: "best-comp", label: "Best Comp" },
  { id: "about", label: "About" },
];

export default function App() {
  const [page, setPage] = useState("draft");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-backdrop" />

      <div className="app-card">
        <header className="app-nav panel">
          <div className="brand-block">
            <div className="brand-chip">Brawl Stars Draft Assistant</div>
            <div className="brand-title-row">
              <div className="brand-title">
                <span>Brawl Draft</span>
                <span className="accent">Lab</span>
              </div>
              <p className="brand-copy">
                Built to keep your draft calm when the lobby gets messy.
              </p>
            </div>
          </div>

          <div className="nav-actions">
            <nav className="nav-links" aria-label="Primary">
              {PAGES.map((item) => (
                <button
                  key={item.id}
                  className={"nav-button" + (page === item.id ? " active" : "")}
                  onClick={() => setPage(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="adv-toggle-wrapper">
              <div className="toggle-copy">
                <span className="toggle-label">Advanced Reasoning</span>
                <span className="toggle-hint">
                  {advanced ? "Long-form draft logic enabled" : "Fast pick blurbs enabled"}
                </span>
              </div>
              <button
                type="button"
                className={"switch" + (advanced ? " on" : "")}
                onClick={() => setAdvanced((value) => !value)}
                aria-pressed={advanced}
                aria-label="Toggle advanced reasoning"
              >
                <div className="switch-knob" />
              </button>
            </div>
          </div>
        </header>

        {page === "home" && <HomePage onStartDraft={() => setPage("draft")} />}
        {page === "draft" && <DraftSimulator advanced={advanced} />}
        {page === "best-comp" && <BestCompPage />}
        {page === "about" && <AboutPage />}
      </div>
    </div>
  );
}

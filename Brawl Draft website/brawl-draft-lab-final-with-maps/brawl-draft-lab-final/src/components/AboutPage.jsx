import React from "react";
import { BRAWLERS } from "../data/brawlers";
import { FALLBACK_BRAWLER_IMAGE } from "../utils/assets";

const brawlerIndex = Object.fromEntries(BRAWLERS.map((brawler) => [brawler.id, brawler]));

const creators = [
  {
    id: "carter",
    display: 'Carter "GOAT" B.',
    role: "Sharpshooter / Lane Specialist",
    avatar: "/assets/draco.jpg",
    favoriteBrawlers: ["piper", "leon", "brock", "angelo", "ash"],
    profileUrl: "https://brawlify.com/stats/profile/2LP2VJG",
  },
  {
    id: "andrew",
    display: 'Andrew "Squadipoo" Robalino',
    role: "Mid / Tank Specialist",
    avatar: "/assets/frank.webp",
    favoriteBrawlers: ["gus", "crow", "finx", "frank", "janet"],
    profileUrl: "https://brawlify.com/stats/profile/LL22UY8",
  },
];

export function AboutPage() {
  return (
    <main className="app-main">
      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">About The Project</span>
            <h2>Built to remove friction from the draft room.</h2>
          </div>
          <div className="inline-badges">
            <span className="status-pill">Since Brawl Stars beta</span>
            <span className="status-pill subtle">Mobile-friendly layout</span>
          </div>
        </div>
        <div className="two-column-copy">
          <p>
            Brawl Draft Lab was put together as a lightweight drafting tool that can actually stay open
            during ranked or scrim sessions. The goal is simple: keep the map, bans, available picks,
            and top recommendations readable without digging through screenshots or static tier lists.
          </p>
          <p>
            The recommendation layer still stays intentionally lightweight. It blends local draft data
            with role-based heuristics so the site remains useful even when a match is moving too fast
            for a deep meta breakdown.
          </p>
        </div>
      </section>

      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Creators</span>
            <h2>Players behind the draft notes.</h2>
          </div>
        </div>

        <div className="creator-grid">
          {creators.map((creator) => (
            <article key={creator.id} className="creator-card">
              <div className="creator-header">
                <img className="creator-avatar" src={creator.avatar} alt={creator.display} />
                <div>
                  <h3>{creator.display}</h3>
                  <p>{creator.role}</p>
                  <a href={creator.profileUrl} target="_blank" rel="noreferrer">
                    View Brawlify profile
                  </a>
                </div>
              </div>

              <div className="signature-strip">
                {creator.favoriteBrawlers.map((id, index) => {
                  const brawler = brawlerIndex[id];
                  if (!brawler) return null;

                  return (
                    <div key={id} className={"signature-brawler" + (index === 0 ? " featured" : "")}>
                      <img
                        src={brawler.image}
                        alt={brawler.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_BRAWLER_IMAGE;
                        }}
                      />
                      <span>{brawler.name}</span>
                      {index === 0 && <span className="signature-badge">Main</span>}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

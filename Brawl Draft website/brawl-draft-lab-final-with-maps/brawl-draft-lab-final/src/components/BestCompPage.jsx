import React, { useMemo, useState } from "react";
import { BRAWLERS } from "../data/brawlers";
import { BEST_COMPS } from "../data/bestComps";
import { MAPS } from "../data/maps";
import { FALLBACK_BRAWLER_IMAGE } from "../utils/assets";

const brawlerIndex = Object.fromEntries(BRAWLERS.map((brawler) => [brawler.id, brawler]));

const mapsByMode = MAPS.reduce((accumulator, map) => {
  accumulator[map.mode] = accumulator[map.mode] || [];
  accumulator[map.mode].push(map);
  return accumulator;
}, {});

function CompBrawler({ id }) {
  const brawler = brawlerIndex[id];
  if (!brawler) return null;

  return (
    <div className="comp-brawler">
      <img
        className="comp-brawler-icon"
        src={brawler.image}
        alt={brawler.name}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_BRAWLER_IMAGE;
        }}
      />
      <strong>{brawler.name}</strong>
      <span>{brawler.role || "Flex"}</span>
    </div>
  );
}

function CompCard({ comp, version }) {
  return (
    <article className="comp-card">
      <div className="comp-card-head">
        <div>
          <span className="eyebrow">Version {version}</span>
          <h3>{comp.name}</h3>
        </div>
        <span className="status-pill gold">Optimal Shell</span>
      </div>

      <p>{comp.plan}</p>

      <div className="comp-team-grid">
        {comp.brawlers.map((id) => (
          <CompBrawler key={id} id={id} />
        ))}
      </div>

      <div className="tag-row">
        {comp.strengths.map((strength) => (
          <span key={strength} className="tag-chip">
            {strength}
          </span>
        ))}
      </div>
    </article>
  );
}

export function BestCompPage() {
  const modeNames = Object.keys(mapsByMode);
  const [selectedMode, setSelectedMode] = useState(modeNames[0]);
  const [selectedMapId, setSelectedMapId] = useState(mapsByMode[modeNames[0]][0].id);

  const currentMap = useMemo(
    () => MAPS.find((map) => map.id === selectedMapId) || mapsByMode[selectedMode]?.[0] || null,
    [selectedMapId, selectedMode]
  );

  const compSet = currentMap ? BEST_COMPS[currentMap.id] || [] : [];

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setSelectedMapId(mapsByMode[mode]?.[0]?.id || "");
  };

  return (
    <main className="app-main">
      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Best Comp</span>
            <h2>Two polished team shells for every ranked map.</h2>
          </div>
          <div className="inline-badges">
            <span className="status-pill">Map-specific</span>
            <span className="status-pill subtle">Two lineup versions</span>
          </div>
        </div>

        <div className="two-column-copy">
          <p>
            This page is for cleaner prep before queueing. Pick a mode and map, then compare two high-value
            lineups that fit the terrain and the usual draft flow on that battleground.
          </p>
          <p>
            These are not meant to replace counterpicking. They give you a strong starting shell, then the
            draft page can handle the live adjustments once bans and enemy picks start to distort the room.
          </p>
        </div>
      </section>

      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Comp Setup</span>
            <h2>Lock the map and compare both versions.</h2>
          </div>
        </div>

        <div className="control-grid">
          <label className="field">
            <span>Mode</span>
            <select value={selectedMode} onChange={(event) => handleModeChange(event.target.value)}>
              {modeNames.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Map</span>
            <select value={selectedMapId} onChange={(event) => setSelectedMapId(event.target.value)}>
              {mapsByMode[selectedMode]?.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field comp-map-label">
            <span>Read</span>
            <div className="comp-map-mode">{currentMap?.mode || selectedMode}</div>
          </div>
        </div>
      </section>

      {currentMap && (
        <section className="panel section best-comp-layout">
          <div className="best-comp-preview">
            <div className="map-preview compact">
              <div className="map-preview-viewport">
                <img className="map-preview-image" src={currentMap.image} alt={currentMap.name} />
              </div>
            </div>

            <div className="map-preview-meta compact">
              <span className="eyebrow">{currentMap.mode}</span>
              <h2>{currentMap.name}</h2>
              <p>
                Use these as your cleanest baseline trios before you start drafting around bans, counters,
                and last-pick abuse.
              </p>
            </div>
          </div>

          <div className="best-comp-grid">
            {compSet.map((comp, index) => (
              <CompCard key={comp.id} comp={comp} version={index + 1} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

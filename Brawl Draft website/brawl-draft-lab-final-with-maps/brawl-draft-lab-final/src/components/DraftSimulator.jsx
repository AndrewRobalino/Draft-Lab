import React, { useMemo, useState } from "react";
import { BRAWLERS } from "../data/brawlers";
import { MAPS } from "../data/maps";
import { estimateDraftOutcome, getRecommendations } from "../data/recommendationEngine";
import { FALLBACK_BRAWLER_IMAGE } from "../utils/assets";

const mapsByMode = MAPS.reduce((accumulator, map) => {
  accumulator[map.mode] = accumulator[map.mode] || [];
  accumulator[map.mode].push(map);
  return accumulator;
}, {});

const brawlerIndex = Object.fromEntries(BRAWLERS.map((brawler) => [brawler.id, brawler]));
const ALL_BRAWLERS_SORTED = [...BRAWLERS].sort((left, right) => left.name.localeCompare(right.name));

function BrawlerIcon({ brawler, className = "" }) {
  return (
    <img
      className={`brawler-icon ${className}`.trim()}
      src={brawler.image}
      alt={brawler.name}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = FALLBACK_BRAWLER_IMAGE;
      }}
    />
  );
}

function DraftSlotGroup({ label, picks, emptyLabel }) {
  return (
    <section className="draft-slot-group">
      <div className="slot-group-header">
        <span>{label}</span>
        <span>{picks.length}</span>
      </div>
      <div className="slot-pill-row">
        {picks.length ? (
          picks.map((id, index) => {
            const brawler = brawlerIndex[id];
            if (!brawler) return null;

            return (
              <div key={`${label}-${index}-${id}`} className="slot-pill">
                <BrawlerIcon brawler={brawler} className="small" />
                <span>{brawler.name}</span>
              </div>
            );
          })
        ) : (
          <div className="empty-note">{emptyLabel}</div>
        )}
      </div>
    </section>
  );
}

function TeamSummary({ label, picks }) {
  return (
    <section className="final-team">
      <div className="slot-group-header">
        <span>{label}</span>
        <span>{picks.length}/3</span>
      </div>
      <div className="final-team-grid">
        {picks.map((id, index) => {
          const brawler = brawlerIndex[id];
          if (!brawler) return null;

          return (
            <div key={`${label}-${index}-${id}`} className="final-team-card">
              <BrawlerIcon brawler={brawler} />
              <strong>{brawler.name}</strong>
              <span>{brawler.role || "Flex"}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation, advanced, onUse }) {
  return (
    <article className={"recommendation-card" + (recommendation.mustPick ? " is-priority" : "")}>
      <div className="recommendation-head">
        <div className="recommendation-title-row">
          <BrawlerIcon brawler={recommendation} />
          <div>
            <div className="recommendation-name-row">
              <h3>{recommendation.name}</h3>
              {recommendation.mustPick && <span className="status-pill gold">Must Pick</span>}
            </div>
            <div className="tag-row">
              {recommendation.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="score-pill">{recommendation.score.toFixed(2)}</span>
      </div>

      <p>{advanced ? recommendation.longExplanation || recommendation.shortExplanation : recommendation.shortExplanation}</p>

      <button type="button" className="secondary-button" onClick={() => onUse(recommendation.id)}>
        Queue this pick
      </button>
    </article>
  );
}

export function DraftSimulator({ advanced }) {
  const modeNames = Object.keys(mapsByMode);
  const [selectedMode, setSelectedMode] = useState(modeNames[0]);
  const [selectedMapId, setSelectedMapId] = useState(mapsByMode[modeNames[0]][0].id);
  const [firstPick, setFirstPick] = useState(true);
  const [bans, setBans] = useState([]);
  const [ourPicks, setOurPicks] = useState([]);
  const [enemyPicks, setEnemyPicks] = useState([]);
  const [search, setSearch] = useState("");
  const [pendingSelection, setPendingSelection] = useState(null);

  const currentMap = useMemo(
    () => MAPS.find((map) => map.id === selectedMapId) || mapsByMode[selectedMode]?.[0] || null,
    [selectedMapId, selectedMode]
  );

  const unavailable = useMemo(
    () => new Set([...bans, ...ourPicks, ...enemyPicks]),
    [bans, ourPicks, enemyPicks]
  );

  const filteredBrawlers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const pool = ALL_BRAWLERS_SORTED.filter((brawler) => !unavailable.has(brawler.id));

    return pool
      .filter((brawler) => {
        if (!query) return true;
        return brawler.name.toLowerCase().includes(query);
      })
      .slice(0, 40);
  }, [search, unavailable]);

  const phase = (() => {
    if (bans.length < 6) return "bans";
    const totalPicks = ourPicks.length + enemyPicks.length;
    if (totalPicks >= 6) return "done";
    return "picks";
  })();

  const pickOrder = firstPick ? ["A", "B", "B", "A", "A", "B"] : ["B", "A", "A", "B", "B", "A"];
  const totalPicks = ourPicks.length + enemyPicks.length;
  const currentPickSide = phase === "picks" ? pickOrder[totalPicks] : null;

  const turnLabel =
    phase === "bans"
      ? `Ban ${bans.length + 1} of 6`
      : phase === "picks"
        ? currentPickSide === "A"
          ? "Your pick"
          : "Enemy pick"
        : "Draft complete";

  const phaseLabel =
    phase === "bans"
      ? "Ban phase"
      : phase === "picks"
        ? "Pick phase"
        : "Finished";

  const handleReset = () => {
    setBans([]);
    setOurPicks([]);
    setEnemyPicks([]);
    setPendingSelection(null);
    setSearch("");
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const nextMap = mapsByMode[mode]?.[0];
    setSelectedMapId(nextMap?.id || "");
    handleReset();
  };

  const handleConfirm = () => {
    if (!pendingSelection) return;

    if (phase === "bans") {
      setBans((current) => [...current, pendingSelection]);
    } else if (phase === "picks") {
      if (currentPickSide === "A") {
        setOurPicks((current) => [...current, pendingSelection]);
      } else {
        setEnemyPicks((current) => [...current, pendingSelection]);
      }
    }

    setPendingSelection(null);
    setSearch("");
  };

  const recommendations = useMemo(() => {
    if (!currentMap || phase !== "picks") return [];

    return getRecommendations({
      mapId: currentMap.id,
      ourPicks,
      enemyPicks,
      bans,
    });
  }, [bans, currentMap, enemyPicks, ourPicks, phase]);

  const pendingBrawler = pendingSelection ? brawlerIndex[pendingSelection] : null;
  const outcome = useMemo(() => {
    if (!currentMap || phase !== "done") return null;

    return estimateDraftOutcome({
      mapId: currentMap.id,
      ourPicks,
      enemyPicks,
      bans,
    });
  }, [bans, currentMap, enemyPicks, ourPicks, phase]);

  const previewStyle = currentMap
    ? {
        "--map-fit": currentMap.preview?.fit || "contain",
        "--map-position": currentMap.preview?.position || "center",
        "--map-scale": currentMap.preview?.scale || "1",
      }
    : undefined;

  return (
    <main className="app-main">
      <section className="draft-hero panel">
        <div className="map-preview-stack">
          <div className="map-preview" style={previewStyle}>
            {currentMap?.image && (
              <div className="map-preview-viewport">
                <img
                  className="map-preview-image"
                  src={currentMap.image}
                  alt={currentMap.name}
                />
              </div>
            )}
          </div>

          <div className="map-preview-meta">
            <span className="eyebrow">{currentMap?.mode || selectedMode}</span>
            <h1>{currentMap?.name || "Select a map"}</h1>
            <p>
              Keep the current battleground in view while you log bans, confirm picks, and read the next
              recommendation without leaving the draft flow.
            </p>
          </div>
        </div>

        <div className="draft-status-grid">
          <div className="status-card">
            <span className="status-kicker">Current phase</span>
            <strong>{phaseLabel}</strong>
            <span>{turnLabel}</span>
          </div>
          <div className="status-card">
            <span className="status-kicker">Draft side</span>
            <strong>{firstPick ? "First Pick" : "Last Pick"}</strong>
            <span>{firstPick ? "You open the pick phase." : "Enemy opens the pick phase."}</span>
          </div>
          <div className="status-card">
            <span className="status-kicker">Pending lock-in</span>
            <strong>{pendingBrawler ? pendingBrawler.name : "Nothing selected"}</strong>
            <span>{pendingBrawler ? "Ready to confirm." : "Choose a brawler from the pool below."}</span>
          </div>
        </div>
      </section>

      <section className="panel section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Draft Setup</span>
            <h2>Set the room before the first ban lands.</h2>
          </div>
          <button type="button" className="secondary-button" onClick={handleReset}>
            Reset draft
          </button>
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
            <select
              value={selectedMapId}
              onChange={(event) => {
                setSelectedMapId(event.target.value);
                handleReset();
              }}
            >
              {mapsByMode[selectedMode]?.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Pick side</span>
            <select
              value={firstPick ? "first" : "last"}
              onChange={(event) => {
                setFirstPick(event.target.value === "first");
                handleReset();
              }}
            >
              <option value="first">First Pick</option>
              <option value="last">Last Pick</option>
            </select>
          </label>
        </div>
      </section>

      <section className="draft-grid">
        <section className="panel section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Live Board</span>
              <h2>Track every locked slot.</h2>
            </div>
          </div>

          <div className="draft-board">
            <DraftSlotGroup label="Bans" picks={bans} emptyLabel="No bans locked yet." />
            <DraftSlotGroup label="Our Picks" picks={ourPicks} emptyLabel="Your team has not picked yet." />
            <DraftSlotGroup label="Enemy Picks" picks={enemyPicks} emptyLabel="Enemy picks will appear here." />
          </div>
        </section>

        <section className="panel section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Selection Pool</span>
              <h2>Search or click a brawler to queue the next action.</h2>
            </div>
          </div>

          <div className="selection-panel">
            <label className="field">
              <span>Search brawler</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Gus, Piper, Meg, and more"
              />
            </label>

            <div className="selection-meta">
              <span className="status-pill subtle">{filteredBrawlers.length} available in current filter</span>
              {pendingBrawler && <span className="status-pill">Selected: {pendingBrawler.name}</span>}
            </div>

            <div className="brawler-grid">
              {filteredBrawlers.map((brawler) => (
                <button
                  key={brawler.id}
                  type="button"
                  className={"brawler-chip" + (pendingSelection === brawler.id ? " active" : "")}
                  onClick={() => setPendingSelection(brawler.id)}
                >
                  <BrawlerIcon brawler={brawler} className="small" />
                  <span>{brawler.name}</span>
                </button>
              ))}
            </div>

            {!filteredBrawlers.length && <div className="empty-note">No available brawlers match that search.</div>}

            <button
              type="button"
              className="primary-button"
              onClick={handleConfirm}
              disabled={!pendingSelection || phase === "done"}
            >
              {phase === "bans"
                ? "Confirm ban"
                : phase === "picks"
                  ? currentPickSide === "A"
                    ? "Confirm our pick"
                    : "Confirm enemy pick"
                  : "Draft complete"}
            </button>
          </div>
        </section>

        <section className="panel section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Recommended Picks</span>
              <h2>Suggestions adapt as the room develops.</h2>
            </div>
          </div>

          <div className="recommendations-column">
            {recommendations.length ? (
              recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  advanced={advanced}
                  onUse={setPendingSelection}
                />
              ))
            ) : (
              <div className="empty-state-card">
                <strong>{phase === "bans" ? "Finish the ban phase first." : "No recommendations available."}</strong>
                <p>
                  {phase === "done"
                    ? "The draft is complete. Review the full board below or reset to start again."
                    : "Recommendations appear once the app reaches the pick phase and has enough draft context to score the pool."}
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      {phase === "done" && outcome && (
        <section className="panel section final-summary">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Draft Complete</span>
              <h2>Full board review and rough win estimate.</h2>
            </div>
          </div>

          <div className="final-summary-grid">
            <div className="win-panel">
              <div className="win-meter">
                <div className="win-meter-fill" style={{ width: `${outcome.ourWinChance}%` }} />
              </div>
              <div className="win-split">
                <div className="win-stat ours">
                  <strong>{outcome.ourWinChance}%</strong>
                  <span>Your side</span>
                </div>
                <div className="win-stat enemy">
                  <strong>{outcome.enemyWinChance}%</strong>
                  <span>Enemy side</span>
                </div>
              </div>
              <p>{outcome.summary}</p>
            </div>

            <div className="final-board">
              <DraftSlotGroup label="Final Bans" picks={bans} emptyLabel="No bans were entered." />
              <div className="final-teams">
                <TeamSummary label="Your Team" picks={ourPicks} />
                <TeamSummary label="Enemy Team" picks={enemyPicks} />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

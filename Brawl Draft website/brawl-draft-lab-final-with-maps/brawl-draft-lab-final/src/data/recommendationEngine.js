import { DRAFTS } from "../data/drafts.js";
import { BRAWLERS } from "../data/brawlers.js";
import { MAPS } from "../data/maps.js";
import { normalizeBrawlerId, normalizeMapId } from "../utils/normalizers.js";

const brawlerIndex = Object.fromEntries(BRAWLERS.map((brawler) => [brawler.id, brawler]));
const mapIndex = Object.fromEntries(MAPS.map((map) => [map.id, map]));

const antiTankIds = new Set([
  "clancy",
  "colt",
  "colette",
  "griff",
  "gus",
  "maisie",
  "pam",
  "pearl",
  "rico",
  "surge",
]);

const heavyDamageIds = new Set([
  "8_bit",
  "amber",
  "chester",
  "clancy",
  "colt",
  "colette",
  "griff",
  "maisie",
  "pearl",
  "rico",
  "surge",
]);

const wallBreakIds = new Set([
  "brock",
  "colt",
  "griff",
  "r_t",
  "stu",
  "surge",
  "tick",
]);

const strongThrowerIds = new Set([
  "barley",
  "dynamike",
  "grom",
  "sprout",
  "tick",
  "willow",
]);

const longRangeIds = new Set([
  "angelo",
  "belle",
  "brock",
  "colt",
  "mandy",
  "nani",
  "piper",
  "rico",
  "r_t",
]);

const midControlIds = new Set([
  "gene",
  "gray",
  "gus",
  "juju",
  "lou",
  "otis",
  "pam",
  "ruffs",
  "sandy",
  "squeak",
  "tara",
]);

const diveIds = new Set([
  "buzz",
  "cordelius",
  "edgar",
  "fang",
  "kenji",
  "leon",
  "lily",
  "mico",
  "mortis",
]);

const modeRoleWeights = {
  Bounty: { Sharpshooter: 0.22, Control: 0.12, Thrower: 0.08, Tank: -0.12 },
  "Brawl Ball": { Tank: 0.2, Control: 0.12, Support: 0.08, Thrower: -0.06 },
  "Gem Grab": { Control: 0.2, Support: 0.16, Tank: 0.08, Sharpshooter: 0.06 },
  Heist: { Sharpshooter: 0.14, Control: 0.1, Thrower: 0.08, Tank: -0.04 },
  "Hot Zone": { Control: 0.22, Thrower: 0.18, Support: 0.08, Tank: 0.06 },
  Knockout: { Sharpshooter: 0.24, Control: 0.1, Thrower: 0.06, Tank: -0.14 },
};

const roleVsRole = {
  Tank: { Sharpshooter: -0.08, Support: 0.06, Thrower: -0.04 },
  Sharpshooter: { Tank: 0.08, Thrower: 0.06, Assassin: -0.08 },
  Support: { Tank: 0.1, Assassin: -0.05, Control: 0.06 },
  Thrower: { Tank: 0.05, Control: 0.05, Assassin: -0.12 },
  Assassin: { Thrower: 0.12, Sharpshooter: 0.08, Tank: -0.12, Control: -0.04 },
  Control: { Assassin: 0.08, Tank: 0.04, Sharpshooter: -0.02 },
};

const stats = {
  globalPickCounts: {},
  modePickCounts: {},
  mapPickCounts: {},
  mapSamples: {},
};

for (const draft of DRAFTS) {
  const mapId = normalizeMapId(draft.mapId);
  const map = mapIndex[mapId];
  if (!map) continue;

  stats.mapPickCounts[mapId] = stats.mapPickCounts[mapId] || {};
  stats.modePickCounts[map.mode] = stats.modePickCounts[map.mode] || {};
  stats.mapSamples[mapId] = (stats.mapSamples[mapId] || 0) + 1;

  for (const rawId of draft.picks) {
    const brawlerId = normalizeBrawlerId(rawId);
    if (!brawlerIndex[brawlerId]) continue;

    stats.globalPickCounts[brawlerId] = (stats.globalPickCounts[brawlerId] || 0) + 1;
    stats.modePickCounts[map.mode][brawlerId] = (stats.modePickCounts[map.mode][brawlerId] || 0) + 1;
    stats.mapPickCounts[mapId][brawlerId] = (stats.mapPickCounts[mapId][brawlerId] || 0) + 1;
  }
}

function getNormalizedScore(counts, id) {
  const values = Object.values(counts || {});
  if (!values.length) return 0;
  const max = Math.max(...values);
  if (!max) return 0;
  return (counts[id] || 0) / max;
}

function detectTeamShape(brawlerIds) {
  const counts = { Tank: 0, Sharpshooter: 0, Support: 0, Thrower: 0, Assassin: 0, Control: 0 };
  for (const id of brawlerIds) {
    const brawler = brawlerIndex[id];
    if (!brawler?.role) continue;
    counts[brawler.role] = (counts[brawler.role] || 0) + 1;
  }
  return counts;
}

function getRoleAdjustment(mapMode, brawler, ourShape, enemyShape, reasons) {
  let score = 0;
  const role = brawler.role;
  if (!role) return score;

  score += modeRoleWeights[mapMode]?.[role] || 0;

  if ((ourShape[role] || 0) >= 2) {
    score -= 0.24;
    reasons.push(`Your team is already stacked on ${role.toLowerCase()}s`);
  } else if ((ourShape[role] || 0) === 0 && ["Support", "Control", "Sharpshooter"].includes(role)) {
    score += 0.08;
    reasons.push(`Adds a missing ${role.toLowerCase()} role`);
  }

  if (role === "Support" && ourShape.Tank >= 1) {
    score += 0.16;
    reasons.push("Pairs well with your frontline");
  }

  if (role === "Control" && ["Gem Grab", "Hot Zone"].includes(mapMode)) {
    score += 0.1;
    reasons.push("Helps hold space on this mode");
  }

  if (role === "Sharpshooter" && ["Bounty", "Knockout"].includes(mapMode)) {
    score += 0.08;
    reasons.push("Fits the long-range pressure this map rewards");
  }

  if (role === "Tank" && enemyShape.Sharpshooter >= 2) {
    score -= 0.14;
    reasons.push("Enemy range makes tanks riskier");
  }

  if (role === "Control" && enemyShape.Assassin >= 2) {
    score += 0.08;
    reasons.push("Adds peel into enemy dive");
  }

  return score;
}

function getCounterAdjustment(brawler, enemyShape, reasons) {
  let score = 0;

  if (enemyShape.Tank >= 2 && antiTankIds.has(brawler.id)) {
    score += 0.24;
    reasons.push("Punishes tank-heavy enemy drafts");
  }

  if (enemyShape.Thrower >= 1 && diveIds.has(brawler.id)) {
    score += 0.1;
    reasons.push("Can pressure fragile backline picks");
  }

  if (enemyShape.Control >= 2 && brawler.role === "Support") {
    score += 0.08;
    reasons.push("Stabilizes slower control-heavy games");
  }

  return score;
}

function getThreatAdjustment(brawler, ourShape, enemyShape, reasons) {
  let score = 0;
  const enemyFrontlineBall = enemyShape.Tank >= 2 && enemyShape.Support >= 1;
  const enemyBacklineBall =
    enemyShape.Thrower >= 2 ||
    (enemyShape.Thrower >= 1 && enemyShape.Sharpshooter >= 1) ||
    (enemyShape.Sharpshooter >= 2 && enemyShape.Control === 0 && enemyShape.Tank === 0);
  const ourLackDamage = ourShape.Sharpshooter === 0 && ourShape.Thrower === 0;
  const ourSupportHeavy = ourShape.Support >= 2;
  const answersFrontline = antiTankIds.has(brawler.id) || heavyDamageIds.has(brawler.id);
  const bruiserAnswersFrontline = ["chester", "clancy", "meg", "sam", "buster"].includes(brawler.id);
  const diveAnswer = diveIds.has(brawler.id) || ["buzz", "chester", "clancy", "melodie"].includes(brawler.id);

  if (enemyFrontlineBall) {
    if (answersFrontline) {
      score += ourLackDamage ? 0.72 : 0.34;
      reasons.push("directly answers the enemy frontline sustain core");
    } else {
      score -= ourLackDamage ? 0.6 : 0.22;
      reasons.push("does not solve the enemy frontline pressure fast enough");
    }
  }

  if (enemyShape.Tank >= 2 && ourShape.Sharpshooter === 0 && brawler.role === "Sharpshooter") {
    score += 0.26;
    reasons.push("gives your side the damage profile it is currently missing");
  }

  if (enemyShape.Support >= 1 && answersFrontline) {
    score += 0.12;
  }

  if (enemyFrontlineBall && bruiserAnswersFrontline) {
    score += 0.16;
  }

  if (enemyBacklineBall) {
    if (diveAnswer) {
      score += 0.42;
      reasons.push("can collapse on the enemy backline before they can stabilize");
    } else if (brawler.role === "Tank" && enemyShape.Thrower >= 2) {
      score -= 0.14;
      reasons.push("struggles into layered thrower pressure");
    } else if (brawler.role === "Support" && enemyShape.Thrower >= 2 && ourShape.Assassin === 0) {
      score -= 0.12;
      reasons.push("does not threaten the enemy backline enough");
    }
  }

  if (ourSupportHeavy && brawler.role === "Support") {
    score -= enemyFrontlineBall ? 0.28 : 0.14;
    reasons.push("would leave your draft too light on damage");
  }

  if (ourLackDamage && !answersFrontline && !["Sharpshooter", "Thrower"].includes(brawler.role || "")) {
    score -= 0.16;
  }

  if (enemyShape.Assassin >= 2 && brawler.role === "Support" && ourShape.Control === 0) {
    score -= 0.1;
    reasons.push("is vulnerable unless your draft adds more peel");
  }

  return score;
}

function getDraftNeedAdjustment(map, brawler, ourPicks, enemyPicks, ourShape, enemyShape, reasons) {
  let score = 0;
  const ourIds = new Set(ourPicks);
  const enemyIds = new Set(enemyPicks);

  const ourHasLongRange = ourPicks.some((id) => longRangeIds.has(id)) || ourShape.Sharpshooter >= 1;
  const ourHasMidControl = ourPicks.some((id) => midControlIds.has(id)) || ourShape.Control >= 1 || ourShape.Support >= 1;
  const enemyHasThrowerAnswer =
    enemyPicks.some((id) => diveIds.has(id) || wallBreakIds.has(id)) || enemyShape.Assassin >= 1;
  const enemyHasLongRange = enemyPicks.some((id) => longRangeIds.has(id)) || enemyShape.Sharpshooter >= 1;
  const enemyHasPeel =
    enemyShape.Control >= 1 ||
    enemyShape.Tank >= 1 ||
    enemyPicks.some((id) => ["charlie", "cordelius", "gale", "kit", "lou", "otis", "tara"].includes(id));

  const brawlerIsThrower = strongThrowerIds.has(brawler.id) || brawler.role === "Thrower";
  const brawlerAddsLongRange = longRangeIds.has(brawler.id) || brawler.role === "Sharpshooter";
  const brawlerAddsMid = midControlIds.has(brawler.id) || ["Control", "Support"].includes(brawler.role || "");
  const brawlerIsFrontline = brawler.role === "Tank" || ["chester", "clancy", "draco", "meg", "sam"].includes(brawler.id);
  const brawlerIsDive = diveIds.has(brawler.id) || ["buzz", "chester", "clancy", "melodie"].includes(brawler.id);
  const enemyBacklineBall =
    enemyShape.Thrower >= 2 ||
    (enemyShape.Thrower >= 1 && enemyShape.Sharpshooter >= 1);

  if (!ourHasLongRange) {
    if (brawlerAddsLongRange) {
      score += 0.22;
      reasons.push("gives your draft the long-range pressure it is missing");
    } else if (ourPicks.length >= 2 && !brawlerIsFrontline) {
      score -= 0.08;
    }
  }

  if (!ourHasMidControl) {
    if (brawlerAddsMid) {
      score += 0.2;
      reasons.push("adds the mid control your draft currently lacks");
    } else if (ourPicks.length >= 2 && !brawlerAddsLongRange) {
      score -= 0.06;
    }
  }

  if (
    map.id === "dueling-beetles" &&
    !enemyHasThrowerAnswer &&
    brawlerIsThrower
  ) {
    score += enemyPicks.length > ourPicks.length ? 0.84 : 0.62;
    reasons.push("can run over this draft because the enemy has no clear thrower answer");
  }

  if (["hard-rock-mine", "undermine", "deathcap-trap", "open-business", "ring-of-fire"].includes(map.id)) {
    if (!enemyHasThrowerAnswer && brawlerIsThrower) {
      score += 0.18;
      reasons.push("gets extra value because the enemy lacks real backline access");
    }
  }

  if (enemyBacklineBall && !enemyHasPeel && brawlerIsDive) {
    score += 0.52;
    reasons.push("is a high-value punish because the enemy draft cannot stop dives cleanly");
  }

  if (enemyBacklineBall && !enemyHasPeel && ["Knockout", "Bounty"].includes(map.mode) && brawlerIsDive) {
    score += 0.12;
  }

  if (enemyShape.Tank >= 2 && enemyShape.Support >= 1 && brawlerIsFrontline && !heavyDamageIds.has(brawler.id)) {
    score -= 0.12;
  }

  if (enemyShape.Sharpshooter >= 2 && !ourHasLongRange && brawlerAddsLongRange) {
    score += 0.16;
    reasons.push("keeps your draft from getting outranged");
  }

  if (ourIds.has("max") && ["chester", "clancy", "sam"].includes(brawler.id)) {
    score += 0.08;
  }

  if (enemyIds.has("byron") && ["chester", "clancy", "sam", "meg"].includes(brawler.id)) {
    score += 0.08;
  }

  return score;
}

function getPickSpecificAdjustment(brawler, ourPicks, enemyPicks, reasons) {
  let score = 0;
  const ourBrawlers = ourPicks.map((id) => brawlerIndex[id]).filter(Boolean);
  const enemyBrawlers = enemyPicks.map((id) => brawlerIndex[id]).filter(Boolean);

  for (const ally of ourBrawlers) {
    if (ally.role && brawler.role && ally.role === brawler.role) {
      score -= 0.08;
    }

    if (ally.role === "Tank" && brawler.role === "Support") {
      score += 0.12;
      reasons.push(`backs up your ${ally.name} with sustain`);
    }

    if (ally.role === "Support" && brawler.role === "Tank") {
      score += 0.1;
      reasons.push(`gives your ${ally.name} a stronger frontline`);
    }

    if (ally.role === "Sharpshooter" && brawler.role === "Control") {
      score += 0.08;
      reasons.push(`helps ${ally.name} play behind firmer map control`);
    }

    if (ally.role === "Control" && brawler.role === "Sharpshooter") {
      score += 0.08;
      reasons.push(`converts the space your ${ally.name} can create`);
    }
  }

  for (const enemy of enemyBrawlers) {
    if (brawler.role && enemy.role) {
      score += roleVsRole[brawler.role]?.[enemy.role] || 0;
    }

    if (antiTankIds.has(brawler.id) && enemy.role === "Tank") {
      score += 0.08;
      reasons.push(`pressures the enemy ${enemy.name}`);
    }

    if (diveIds.has(brawler.id) && ["Thrower", "Sharpshooter"].includes(enemy.role)) {
      score += 0.06;
      reasons.push(`can reach the enemy ${enemy.name}`);
    }

    if (brawler.role === "Control" && enemy.role === "Assassin") {
      score += 0.06;
      reasons.push(`adds peel into ${enemy.name}`);
    }
  }

  return score;
}

function buildExplanation({ brawler, map, reasons, mapScore, modeScore, globalScore }) {
  const primaryReasons = reasons.slice(0, 2);
  let shortExplanation = `${brawler.name} has one of the better profiles left on ${map.name}.`;

  if (primaryReasons.length) {
    shortExplanation = `${brawler.name} stands out here because it ${primaryReasons[0].charAt(0).toLowerCase()}${primaryReasons[0].slice(1)}.`;
  } else if (mapScore >= 0.85) {
    shortExplanation = `${brawler.name} shows up constantly on ${map.name} in the stored draft sample.`;
  }

  const longParts = [];

  if (mapScore >= 0.7) {
    longParts.push(`${brawler.name} is one of the stronger remaining map picks in the original draft sample for ${map.name}.`);
  } else if (modeScore >= 0.7) {
    longParts.push(`${brawler.name} is not just generic filler here. It appears regularly across ${map.mode} drafts in the source data.`);
  } else {
    longParts.push(`${brawler.name} is more situational, but it still fits the room better than the remaining alternatives.`);
  }

  if (primaryReasons.length) {
    longParts.push(primaryReasons.join(". ") + ".");
  }

  if (globalScore >= 0.6 && mapScore < 0.5) {
    longParts.push("Its value is coming more from broad draft presence than from this exact map alone.");
  }

  return {
    shortExplanation,
    longExplanation: longParts.join(" "),
  };
}

export function getRecommendations({ mapId, ourPicks, enemyPicks, bans }) {
  const normalizedMapId = normalizeMapId(mapId);
  const map = mapIndex[normalizedMapId];
  if (!map) return [];

  const normalizedOurPicks = ourPicks.map(normalizeBrawlerId);
  const normalizedEnemyPicks = enemyPicks.map(normalizeBrawlerId);
  const unavailable = new Set(
    [...normalizedOurPicks, ...normalizedEnemyPicks, ...bans.map(normalizeBrawlerId)]
  );

  const ourShape = detectTeamShape(normalizedOurPicks);
  const enemyShape = detectTeamShape(normalizedEnemyPicks);
  const mapCounts = stats.mapPickCounts[normalizedMapId] || {};
  const modeCounts = stats.modePickCounts[map.mode] || {};
  const mapSampleCount = stats.mapSamples[normalizedMapId] || 0;

  const scored = [];

  for (const brawler of BRAWLERS) {
    if (unavailable.has(brawler.id)) continue;

    const mapScore = getNormalizedScore(mapCounts, brawler.id);
    const modeScore = getNormalizedScore(modeCounts, brawler.id);
    const globalScore = getNormalizedScore(stats.globalPickCounts, brawler.id);
    const reasons = [];

    let score = mapScore * 1.95 + modeScore * 0.7 + globalScore * 0.2;

    if (mapScore >= 0.85) reasons.push("is one of the most repeated picks on this exact map");
    else if (modeScore >= 0.8) reasons.push(`has strong presence across ${map.mode} drafts`);

    score += getRoleAdjustment(map.mode, brawler, ourShape, enemyShape, reasons);
    score += getCounterAdjustment(brawler, enemyShape, reasons);
    score += getThreatAdjustment(brawler, ourShape, enemyShape, reasons);
    score += getDraftNeedAdjustment(
      map,
      brawler,
      normalizedOurPicks,
      normalizedEnemyPicks,
      ourShape,
      enemyShape,
      reasons
    );
    score += getPickSpecificAdjustment(brawler, normalizedOurPicks, normalizedEnemyPicks, reasons);

    if (normalizedOurPicks.length === 0 && mapScore < 0.25 && modeScore < 0.25) {
      score -= 0.08;
    }

    const tags = new Set();
    if (mapScore >= 0.85) tags.add("Map Priority");
    else if (modeScore >= 0.75) tags.add("Mode Comfort");
    else if (globalScore >= 0.65) tags.add("Stable Pick");
    else tags.add("Situational");

    for (const tag of brawler.tags || []) tags.add(tag);
    if (enemyShape.Tank >= 2 && antiTankIds.has(brawler.id)) tags.add("Tank Counter");
    if (enemyShape.Tank >= 2 && enemyShape.Support >= 1 && (antiTankIds.has(brawler.id) || heavyDamageIds.has(brawler.id))) {
      tags.add("Threat Answer");
    }
    if (
      (enemyShape.Thrower >= 2 || (enemyShape.Thrower >= 1 && enemyShape.Sharpshooter >= 1)) &&
      (diveIds.has(brawler.id) || ["buzz", "chester", "clancy", "melodie"].includes(brawler.id))
    ) {
      tags.add("Backline Punish");
    }
    if (!normalizedOurPicks.some((id) => longRangeIds.has(id)) && (longRangeIds.has(brawler.id) || brawler.role === "Sharpshooter")) {
      tags.add("Range Need");
    }
    if (!normalizedOurPicks.some((id) => midControlIds.has(id)) && (midControlIds.has(brawler.id) || ["Control", "Support"].includes(brawler.role || ""))) {
      tags.add("Mid Need");
    }
    if (map.id === "dueling-beetles" && !normalizedEnemyPicks.some((id) => diveIds.has(id) || wallBreakIds.has(id)) && (strongThrowerIds.has(brawler.id) || brawler.role === "Thrower")) {
      tags.add("Exploit Pick");
    }
    if (["Gem Grab", "Hot Zone"].includes(map.mode) && brawler.role === "Control") tags.add("Zone Value");
    if (["Bounty", "Knockout"].includes(map.mode) && brawler.role === "Sharpshooter") tags.add("Range Pressure");
    if (normalizedOurPicks.length || normalizedEnemyPicks.length) tags.add("Current Draft");

    const explanation = buildExplanation({
      brawler,
      map,
      reasons,
      mapScore,
      modeScore,
      globalScore,
    });

    scored.push({
      id: brawler.id,
      name: brawler.name,
      image: brawler.image,
      role: brawler.role,
      tags: Array.from(tags),
      score,
      mapScore,
      modeScore,
      globalScore,
      ...explanation,
    });
  }

  scored.sort((left, right) => right.score - left.score);
  const top = scored.slice(0, 3);
  if (!top.length) return [];

  const mustPickGap = (top[0]?.score || 0) - (top[1]?.score || 0);
  const shouldForcePriority =
    top[0] && (top[0].mapScore >= 0.92 || (top[0].mapScore >= 0.78 && mustPickGap >= 0.24));

  return top.map((entry, index) => ({
    ...entry,
    mustPick: Boolean(shouldForcePriority && index === 0),
  }));
}

export function estimateDraftOutcome({ mapId, ourPicks, enemyPicks, bans = [] }) {
  const normalizedMapId = normalizeMapId(mapId);
  const map = mapIndex[normalizedMapId];
  if (!map) {
    return {
      ourWinChance: 50,
      enemyWinChance: 50,
      summary: "No map context available for an estimate.",
    };
  }

  const normalizedOurPicks = ourPicks.map(normalizeBrawlerId);
  const normalizedEnemyPicks = enemyPicks.map(normalizeBrawlerId);
  const unavailable = new Set([...normalizedOurPicks, ...normalizedEnemyPicks, ...bans.map(normalizeBrawlerId)]);
  const ourShape = detectTeamShape(normalizedOurPicks);
  const enemyShape = detectTeamShape(normalizedEnemyPicks);
  const mapCounts = stats.mapPickCounts[normalizedMapId] || {};
  const modeCounts = stats.modePickCounts[map.mode] || {};

  function scoreTeam(teamPicks, teamShape, opposingPicks, opposingShape) {
    let total = 0;

    for (const id of teamPicks) {
      const brawler = brawlerIndex[id];
      if (!brawler) continue;

      total += getNormalizedScore(mapCounts, id) * 1.75;
      total += getNormalizedScore(modeCounts, id) * 0.55;
      total += getNormalizedScore(stats.globalPickCounts, id) * 0.2;
      total += getRoleAdjustment(map.mode, brawler, teamShape, opposingShape, []);
      total += getCounterAdjustment(brawler, opposingShape, []);
      total += getPickSpecificAdjustment(brawler, teamPicks.filter((pick) => pick !== id), opposingPicks, []);
    }

    if (teamShape.Control >= 1 && ["Gem Grab", "Hot Zone"].includes(map.mode)) total += 0.15;
    if (teamShape.Sharpshooter >= 1 && ["Bounty", "Knockout"].includes(map.mode)) total += 0.12;
    if (teamShape.Support >= 1 && teamShape.Tank >= 1) total += 0.12;
    if (teamShape.Tank >= 2 && opposingShape.Sharpshooter >= 2) total -= 0.16;

    return total;
  }

  const ourScore = scoreTeam(normalizedOurPicks, ourShape, normalizedEnemyPicks, enemyShape);
  const enemyScore = scoreTeam(normalizedEnemyPicks, enemyShape, normalizedOurPicks, ourShape);
  const gap = ourScore - enemyScore;
  const ourWinChance = Math.max(18, Math.min(82, Math.round(50 + gap * 10)));
  const enemyWinChance = 100 - ourWinChance;

  let summary = "Both drafts look close on paper.";
  if (ourWinChance >= 58) {
    summary = "Your side looks cleaner for this map based on the stored sample, role coverage, and counters.";
  } else if (ourWinChance <= 42) {
    summary = "The enemy side currently looks better rounded for this map and draft state.";
  }

  if (unavailable.size < 12) {
    summary += " This estimate is directional rather than exact.";
  }

  return {
    ourWinChance,
    enemyWinChance,
    summary,
  };
}

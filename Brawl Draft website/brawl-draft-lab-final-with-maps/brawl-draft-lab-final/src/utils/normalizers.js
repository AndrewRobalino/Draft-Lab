const MAP_ID_ALIASES = {
  "belle-s-rock": "belles-rock",
  "map-1-deathcap-trap": "deathcap-trap",
  "map-2-sunny-soccer": "sunny-soccer",
  "map-3-open-business": "open-business",
  "map-1-layer-cake": "layer-cake",
  "map-2-dueling-beetles": "dueling-beetles",
  "map-3-new-horizons": "new-horizons",
  "map-4-deathcap-trap": "deathcap-trap",
  "map-1-hot-potato": "hot-potato",
  "map-2-undermine": "undermine",
  "map-3-super-beach": "super-beach",
  "map-4-belles-rock": "belles-rock",
  "map-5-ring-of-fire": "ring-of-fire",
  "map-1-goldarm-gulch": "goldarm-gulch",
  "map-2-kaboom-canyon": "kaboom-canyon",
  "map-3-undermine": "undermine",
  "map-4-dueling-beetles": "dueling-beetles",
};

const BRAWLER_ID_ALIASES = {
  larry_laurie: "larry_and_lawrie",
};

export function normalizeMapId(id) {
  return MAP_ID_ALIASES[id] || id;
}

export function normalizeBrawlerId(id) {
  return BRAWLER_ID_ALIASES[id] || id;
}

import { getMapImage } from "../utils/assets.js";

function createMap(id, name, mode, preview = {}) {
  return {
    id,
    name,
    mode,
    image: getMapImage(id),
    preview,
  };
}

export const MAPS = [
  createMap("dry-season", "Dry Season", "Bounty"),
  createMap("hideout", "Hideout", "Bounty"),
  createMap("layer-cake", "Layer Cake", "Bounty"),
  createMap("pinhole-punt", "Pinhole Punt", "Brawl Ball"),
  createMap("sunny-soccer", "Sunny Soccer", "Brawl Ball"),
  createMap("super-beach", "Super Beach", "Brawl Ball"),
  createMap("deathcap-trap", "Deathcap Trap", "Gem Grab"),
  createMap("hard-rock-mine", "Hard Rock Mine", "Gem Grab"),
  createMap("undermine", "Undermine", "Gem Grab"),
  createMap("hot-potato", "Hot Potato", "Heist"),
  createMap("kaboom-canyon", "Kaboom Canyon", "Heist"),
  createMap("pit-stop", "Pit Stop", "Heist"),
  createMap("dueling-beetles", "Dueling Beetles", "Hot Zone"),
  createMap("open-business", "Open Business", "Hot Zone"),
  createMap("ring-of-fire", "Ring of Fire", "Hot Zone"),
  createMap("belles-rock", "Belle's Rock", "Knockout"),
  createMap("goldarm-gulch", "Goldarm Gulch", "Knockout"),
  createMap("new-horizons", "New Horizons", "Knockout"),
];

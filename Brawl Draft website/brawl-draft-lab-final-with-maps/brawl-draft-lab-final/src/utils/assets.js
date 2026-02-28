export const FALLBACK_BRAWLER_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="24" fill="#0b0b0b"/>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#171717" stroke="#d4af37" stroke-width="4"/>
      <circle cx="60" cy="46" r="18" fill="#d4af37"/>
      <path d="M32 92c7-16 17-24 28-24s21 8 28 24" fill="none" stroke="#f1d27a" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `);

export function getBrawlerImage(id) {
  return `/assets/brawlers/${id}.webp`;
}

export function getMapImage(id) {
  return `/assets/maps/${id.replace(/-/g, "_")}.png`;
}

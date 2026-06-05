/**
 * Lightweight geo for the in-person / hybrid location filter.
 * Approximate [lat, lon] for the NL cities our coaches sit in, plus the major
 * cities offered as quick-picks. Unknown cities are treated as "no constraint"
 * (we never exclude a coach we can't place).
 */
const CITY_COORDS: Record<string, [number, number]> = {
  amsterdam: [52.37, 4.9],
  rotterdam: [51.92, 4.48],
  "den haag": [52.08, 4.31],
  utrecht: [52.09, 5.12],
  eindhoven: [51.44, 5.48],
  groningen: [53.22, 6.57],
  tilburg: [51.56, 5.09],
  breda: [51.59, 4.78],
  nijmegen: [51.84, 5.86],
  arnhem: [51.98, 5.91],
  haarlem: [52.38, 4.64],
  zwolle: [52.51, 6.09],
  enschede: [52.22, 6.9],
  maastricht: [50.85, 5.69],
  leiden: [52.16, 4.49],
  amersfoort: [52.16, 5.39],
  apeldoorn: [52.21, 5.97],
  "s-hertogenbosch": [51.7, 5.3],
  "den bosch": [51.7, 5.3],
  almere: [52.35, 5.26],
};

/** Major NL cities offered as quick-pick chips for the location question. */
export const CITY_OPTIONS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Groningen", "Tilburg", "Breda", "Nijmegen",
];

function norm(city: string): string {
  return city
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // "Amsterdam (Zuidas)" -> "amsterdam"
    .replace(/[’'`]/g, "")
    .trim();
}

function coords(city: string | undefined): [number, number] | undefined {
  if (!city) return undefined;
  return CITY_COORDS[norm(city)];
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** True if coachCity is within rangeKm of userCity. Unknown city → not excluded. */
export function withinRange(coachCity: string, userCity: string, rangeKm: number): boolean {
  const a = coords(coachCity);
  const b = coords(userCity);
  if (!a || !b) return true;
  return haversineKm(a, b) <= rangeKm;
}

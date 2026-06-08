/**
 * Geo for the in-person / hybrid location filter + the city search box.
 *
 * Coordinates and the searchable place list come from lib/cities.json, generated
 * from the GeoNames NL postal dump (CC-BY) by data/build_cities.py — ~2,400 Dutch
 * towns and villages, so the search covers everyone and the range filter has real
 * distances everywhere. Unknown places are treated as "no constraint".
 */
import citiesData from "./cities.json";

const CITY_COORDS = citiesData.coords as unknown as Record<string, [number, number]>;

/** Searchable place list (display names). citiesData.top holds the 5 defaults. */
export const NL_CITIES = citiesData.names as string[];
const TOP_CITIES = citiesData.top as string[];

function norm(city: string): string {
  return city
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[’'`]/g, "")
    .trim();
}

/** Suggestions for the search box: 5 largest when empty, else prefix-then-substring. */
export function searchCities(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOP_CITIES;
  const starts: string[] = [];
  const incl: string[] = [];
  for (const c of NL_CITIES) {
    const lc = c.toLowerCase();
    if (lc.startsWith(q)) starts.push(c);
    else if (lc.includes(q)) incl.push(c);
    if (starts.length >= limit) break;
  }
  return [...starts, ...incl].slice(0, limit);
}

function coords(city: string | undefined): [number, number] | undefined {
  return city ? CITY_COORDS[norm(city)] : undefined;
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

/** Distance in km between two place names, or undefined if either is unknown. */
export function cityDistanceKm(a: string, b: string): number | undefined {
  const ca = coords(a);
  const cb = coords(b);
  if (!ca || !cb) return undefined;
  return haversineKm(ca, cb);
}

/** True if coachCity is within rangeKm of userCity. Unknown place → not excluded. */
export function withinRange(coachCity: string, userCity: string, rangeKm: number): boolean {
  const d = cityDistanceKm(coachCity, userCity);
  if (d === undefined) return true;
  return d <= rangeKm;
}

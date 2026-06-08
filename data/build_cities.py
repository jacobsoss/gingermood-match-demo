"""
Build lib/cities.json from the GeoNames NL postal dump (CC-BY).
~2,400 Dutch woonplaatsen with centroid coordinates, so the location search
covers every town/village and the range filter has real distances everywhere.

Run:  python data/build_cities.py
"""
import urllib.request, zipfile, io, json, re, collections, os, unicodedata

URL = "https://download.geonames.org/export/zip/NL.zip"

# Five largest cities, shown as default suggestions (newest GeoNames uses the
# official name "'s-Gravenhage" for Den Haag — we surface the common name).
TOP = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven"]

# Common names people actually type -> the GeoNames official name to borrow
# coordinates from (and to add as a searchable display name).
ALIASES = {
    "Den Haag": "'s-Gravenhage",
    "Den Bosch": "'s-Hertogenbosch",
}


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[’'`]", "", s)
    return s.strip()


def main() -> None:
    print("downloading", URL)
    data = urllib.request.urlopen(URL, timeout=60).read()
    z = zipfile.ZipFile(io.BytesIO(data))
    rows = [r.split("\t") for r in z.read("NL.txt").decode("utf-8").splitlines() if r.strip()]

    # Average all postal-code centroids per place name.
    acc = collections.defaultdict(lambda: [0.0, 0.0, 0])
    for r in rows:
        name, lat, lon = r[2], r[9], r[10]
        if not (name and lat and lon):
            continue
        a = acc[name]
        a[0] += float(lat)
        a[1] += float(lon)
        a[2] += 1

    names = []
    coords = {}
    for name, (slat, slon, n) in acc.items():
        names.append(name)
        coords[norm(name)] = [round(slat / n, 4), round(slon / n, 4)]

    # Add common-name aliases (borrow coordinates from the official name).
    for alias, official in ALIASES.items():
        k = norm(official)
        if k in coords:
            coords[norm(alias)] = coords[k]
            if alias not in names:
                names.append(alias)

    # Sort display names (Dutch-ish: case-insensitive, accent-insensitive).
    def key(s: str) -> str:
        return "".join(
            c for c in unicodedata.normalize("NFKD", s.lower()) if not unicodedata.combining(c)
        )

    names = sorted(set(names), key=key)

    out = {"top": TOP, "names": names, "coords": coords}
    dest = os.path.join(os.path.dirname(__file__), "..", "lib", "cities.json")
    dest = os.path.abspath(dest)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

    size = os.path.getsize(dest)
    print(f"wrote {dest}")
    print(f"  {len(names)} names, {len(coords)} coord keys, {size/1024:.0f} KB")
    for t in TOP:
        print(f"  default {t!r}: {coords.get(norm(t))}")


if __name__ == "__main__":
    main()

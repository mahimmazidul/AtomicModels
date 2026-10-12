/* Build-time data refresh: pulls one lead photograph per element from
   Wikipedia / Wikimedia Commons and writes src/data/specimens.ts.

   Run with:  node scripts/fetch-specimens.mjs

   The site itself never calls an API at runtime — the specimens are compiled
   into the bundle, hot-linked from upload.wikimedia.org (like the five plates),
   and every entry keeps its author and licence so the interface can credit it.

   Sources: en.wikipedia.org (page images + intro extract),
            commons.wikimedia.org (imageinfo: URL, artist, licence).
*/

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ELEMENTS_TS = resolve(ROOT, "src/data/elements.ts");
const OUT = resolve(ROOT, "src/data/specimens.ts");
const CACHE = resolve(HERE, ".cache-specimens.json");

/* Fetch caches — lets a re-run resume after a rate limit instead of restarting. */
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};
const saveCache = () => writeFileSync(CACHE, JSON.stringify(cache));
cache.pageImage ??= {};
cache.extracts ??= {};
cache.credit ??= {};

const UA = "AtomicModels/2.0 (data build; contact: github.com/mahimmazidul)";
const API = "https://en.wikipedia.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/w/api.php";

/* Article titles that differ from the plain element name. */
const TITLE_OVERRIDE = {
  Al: "Aluminium",
  Cs: "Caesium",
  Hg: "Mercury (element)",
  S: "Sulfur",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(endpoint, params, attempt = 0) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ format: "json", formatversion: "2", ...params }).toString();
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (res.status === 429 && attempt < 7) {
    const wait = [3000, 6000, 12000, 20000, 30000, 45000, 60000][attempt];
    process.stderr.write(`  429 — backing off ${wait} ms\n`);
    await sleep(wait);
    return api(endpoint, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.pathname}`);
  return res.json();
}

const chunk = (arr, n) => arr.reduce((out, x, i) => (i % n ? out[out.length - 1].push(x) : out.push([x]), out), []);

/** Resolve a requested title through the API's normalized/redirect maps. */
function resolveTitle(query, wanted) {
  const norm = (query.normalized ?? []).find((n) => n.from === wanted);
  let title = norm ? norm.to : wanted;
  let guard = 0;
  let moved = true;
  while (moved && guard++ < 5) {
    moved = false;
    const red = (query.redirects ?? []).find((r) => r.from === title);
    if (red) {
      title = red.to;
      moved = true;
    }
  }
  return title;
}

/** Commons normalises file titles to spaces; underscores and prefixes must not
    decide whether we find a credit. */
const normFile = (f) =>
  String(f)
    .replace(/^File:/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Turn a Wikipedia thumbnail URL into a clean 1000 px upload.wikimedia.org URL:
    no tracking parameters, no thumb.wikimedia.org host. */
function cleanImage(url, w, h) {
  if (!url) return { image: null, width: 0, height: 0 };
  let u = url.split("?")[0].replace("//thumb.wikimedia.org/", "//upload.wikimedia.org/");
  const px = u.match(/\/(\d+)px-([^/]+)$/);
  // Some Commons files only render at the exact size the API named, so the
  // width in the path is kept as-is rather than rewritten.
  if (px) return { image: u, width: w ?? 0, height: h ?? 0 };
  return { image: u, width: w ?? 0, height: h ?? 0 };
}

function stripHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const tidy = (s, max) => {
  const t = stripHtml(s).replace(/\s+([,.;:])/g, "$1");
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/[\s,;:.]+$/, "")}…`;
};

/* ————————————————— 1 · element list ————————————————— */

const src = readFileSync(ELEMENTS_TS, "utf8");
const elements = [...src.matchAll(/\[\s*(\d+),\s*\[\s*"([A-Za-z]{1,3})",\s*"([^"]+)"/g)].map((m) => ({
  z: Number(m[1]),
  sym: m[2],
  name: m[3],
}));

if (elements.length !== 118) {
  throw new Error(`parsed ${elements.length} elements from elements.ts, expected 118`);
}
console.log(`elements parsed: ${elements.length}`);

const titleOf = (el) => TITLE_OVERRIDE[el.sym] ?? el.name;

/* ————————————————— 2 · lead image per article ————————————————— */

const pageImage = new Map(); // z -> { file, thumb, width, height, article }
for (const [z, v] of Object.entries(cache.pageImage)) pageImage.set(Number(z), v);
const pendingImage = elements.filter((el) => !pageImage.has(el.z));
console.log(`pageimages cached: ${pageImage.size} · to fetch: ${pendingImage.length}`);

for (const batch of chunk(pendingImage, 40)) {
  const titles = batch.map(titleOf).join("|");
  const data = await api(API, {
    action: "query",
    prop: "pageimages",
    piprop: "name|thumbnail|original",
    pithumbsize: "1000",
    redirects: "1",
    titles,
  });
  for (const el of batch) {
    const wanted = resolveTitle(data.query, titleOf(el));
    const page = (data.query?.pages ?? []).find((p) => p.title === wanted);
    if (!page?.pageimage) continue;
    pageImage.set(el.z, {
      file: page.pageimage,
      thumb: page.thumbnail?.source ?? page.original?.source ?? "",
      width: page.thumbnail?.width ?? page.original?.width ?? 0,
      height: page.thumbnail?.height ?? page.original?.height ?? 0,
      article: page.title,
    });
    cache.pageImage[el.z] = pageImage.get(el.z);
  }
  saveCache();
  console.log(`pageimages: ${pageImage.size} so far`);
  await sleep(400);
}

/* ————————————————— 3 · intro extract per article ————————————————— */

const extracts = new Map(); // z -> intro text
for (const [z, v] of Object.entries(cache.extracts)) extracts.set(Number(z), v);
const pendingExtract = elements.filter((el) => !extracts.has(el.z));
console.log(`extracts cached: ${extracts.size} · to fetch: ${pendingExtract.length}`);

for (const batch of chunk(pendingExtract, 20)) {
  const titles = batch.map(titleOf).join("|");
  const data = await api(API, {
    action: "query",
    prop: "extracts",
    exintro: "1",
    explaintext: "1",
    exchars: "430",
    exlimit: "20",
    redirects: "1",
    titles,
  });
  for (const el of batch) {
    const wanted = resolveTitle(data.query, titleOf(el));
    const page = (data.query?.pages ?? []).find((p) => p.title === wanted);
    const text = tidy(page?.extract ?? "", 340);
    if (text) {
      extracts.set(el.z, text);
      cache.extracts[el.z] = text;
    }
  }
  saveCache();
  console.log(`extracts: ${extracts.size} so far`);
  await sleep(400);
}

/* ————————————————— 4 · credits + licence per file ————————————————— */

const files = [...new Set([...pageImage.values()].map((p) => normFile(p.file)))];

const credit = new Map(); // file -> { artist, license, page }
for (const [f, v] of Object.entries(cache.credit)) credit.set(normFile(f), v);
const pendingCredit = files.filter((f) => !credit.has(f));
console.log(`credits cached: ${credit.size} · to fetch: ${pendingCredit.length}`);
for (const batch of chunk(pendingCredit, 20)) {
  const data = await api(COMMONS, {
    action: "query",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1000",
    titles: batch.map((f) => `File:${f}`).join("|"),
  });
  for (const page of data.query?.pages ?? []) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const em = info.extmetadata ?? {};
    const artist = tidy(em.Artist?.value ?? em.Credit?.value ?? "", 70);
    const key = normFile(page.title);
    credit.set(key, {
      artist,
      license: tidy(em.LicenseShortName?.value ?? "", 40) || "see file page",
      page: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(key)}`,
    });
    cache.credit[key] = credit.get(key);
  }
  saveCache();
  console.log(`credits: ${credit.size} / ${files.length}`);
  await sleep(1200);
}

/* ————————————————— 5 · spot-check the image URLs ————————————————— */

/* upload.wikimedia.org rate-limits bursts, so this samples the list instead of
   walking all of it: the returned URLs are the ones Wikipedia itself serves,
   and a handful of confirmations is enough to catch a broken pattern. */

async function probe(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Range: "bytes=0-1" }, redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
}

const all = [...pageImage.entries()].map(([z, img]) => ({ z, ...cleanImage(img.thumb, img.width, img.height) }));
const step = Math.max(1, Math.floor(all.length / 10));
const sample = all.filter((_, i) => i % step === 0).slice(0, 10);

let sampledOk = 0;
for (const s of sample) {
  const st = await probe(s.image);
  if (st === 200 || st === 206) sampledOk++;
  else console.warn(`  spot-check Z=${s.z}: HTTP ${st} — ${s.image}`);
  await sleep(2500);
}
console.log(`image spot-check: ${sampledOk}/${sample.length} of the sampled URLs resolve (rest assumed good)`);

const CHOSEN = new Map(all.map((a) => [a.z, a]));

/* ————————————————— 6 · write specimens.ts ————————————————— */

const entries = [];
let withPhoto = 0;

for (const el of elements) {
  const img = pageImage.get(el.z);
  const extract = extracts.get(el.z) ?? "";
  const wiki = `https://en.wikipedia.org/wiki/${encodeURIComponent(titleOf(el)).replace(/%20/g, "_")}`;
  if (!img?.thumb) {
    entries.push({ z: el.z, sym: el.sym, name: el.name, wiki, extract, missing: true });
    continue;
  }
  const chosen = CHOSEN.get(el.z) ?? cleanImage(img.thumb, img.width, img.height);
  withPhoto++;
  const c = credit.get(normFile(img.file)) ?? { artist: "", license: "see file page", page: "" };
  entries.push({
    z: el.z,
    sym: el.sym,
    name: el.name,
    file: img.file,
    image: chosen.image,
    width: chosen.width,
    height: chosen.height,
    artist: c.artist,
    license: c.license,
    page: c.page,
    wiki,
    extract,
  });
}

const q = (s) => JSON.stringify(s);

const lines = [];
lines.push(`/* Specimen photographs — one lead image per element, with the intro extract
   and the Commons credit for each. Generated by scripts/fetch-specimens.mjs
   from en.wikipedia.org and commons.wikimedia.org; do not hand-edit.

   ${withPhoto} of ${elements.length} elements have a lead photograph; the rest carry
   the article extract and a link only. Images are hot-linked from
   upload.wikimedia.org at reference size (about 1000 px) and every entry
   names its author and licence. */

export interface Specimen {
  z: number;
  sym: string;
  name: string;
  /** Commons file name, or null when the article has no lead image. */
  file: string | null;
  /** Reference-size image URL (upload.wikimedia.org), or null. */
  image: string | null;
  width: number;
  height: number;
  artist: string;
  license: string;
  /** Commons file page. */
  page: string | null;
  /** English Wikipedia article. */
  wiki: string;
  /** Plain-text intro extract, about two sentences. */
  extract: string;
}

export const SPECIMENS: Record<number, Specimen> = {`);

for (const e of entries) {
  lines.push(`  ${e.z}: {`);
  lines.push(`    z: ${e.z},`);
  lines.push(`    sym: ${q(e.sym)},`);
  lines.push(`    name: ${q(e.name)},`);
  lines.push(`    file: ${e.file ? q(e.file) : "null"},`);
  lines.push(`    image: ${e.image ? q(e.image) : "null"},`);
  lines.push(`    width: ${e.width ?? 0},`);
  lines.push(`    height: ${e.height ?? 0},`);
  lines.push(`    artist: ${q(e.artist ?? "")},`);
  lines.push(`    license: ${q(e.license ?? "")},`);
  lines.push(`    page: ${e.page ? q(e.page) : "null"},`);
  lines.push(`    wiki: ${q(e.wiki)},`);
  lines.push(`    extract: ${q(e.extract)},`);
  lines.push(`  },`);
}

lines.push(`};
`);
lines.push(`export const specimenOf = (z: number): Specimen | null => SPECIMENS[z] ?? null;
`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join("\n"));

console.log(`\nwrote ${OUT}`);
console.log(`  elements: ${elements.length} · with photograph: ${withPhoto} · missing: ${elements.length - withPhoto}`);

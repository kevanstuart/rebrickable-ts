/**
 * Captures real Rebrickable API responses as JSON fixtures, used to check the
 * models and as fake responses in unit tests.
 *
 * Usage: yarn fixtures   (reads REBRICKABLE_API_KEY from .env)
 *
 * Makes about 30 requests, one every 1.1 seconds. Only public catalogue
 * data is saved; the API key is sent as a header and never written to disk.
 */
import { mkdir, writeFile } from 'node:fs/promises';

const BASE_URL = 'https://rebrickable.com/api/v3';
const OUT_DIR = new URL('../src/__tests__/fixtures/', import.meta.url);
const REQUEST_INTERVAL = 1100;

/** Fixture name → request path. Small page sizes keep the fixtures readable. */
const CAPTURES: Record<string, string> = {
  'colors.list': '/lego/colors/?page_size=3',
  'colors.get': '/lego/colors/4/',

  'elements.get': '/lego/elements/4244370/',

  'minifigs.list': '/lego/minifigs/?page_size=3&in_theme_id=158',
  'minifigs.get': '/lego/minifigs/fig-010697/',
  'minifigs.parts': '/lego/minifigs/fig-010697/parts/?page_size=3',
  'minifigs.parts.details': '/lego/minifigs/fig-010697/parts/?page_size=3&inc_part_details=1',
  'minifigs.sets': '/lego/minifigs/fig-010697/sets/?page_size=3',

  'part-categories.list': '/lego/part_categories/?page_size=3',
  'part-categories.get': '/lego/part_categories/11/',

  'parts.list': '/lego/parts/?page_size=3&part_cat_id=11',
  'parts.list.details': '/lego/parts/?page_size=3&part_cat_id=11&inc_part_details=1',
  'parts.get': '/lego/parts/3001/',
  'parts.get.printed': '/lego/parts/3005pr0025/',
  'parts.colors': '/lego/parts/3001/colors/?page_size=3',
  'parts.color': '/lego/parts/3001/colors/4/',
  'parts.color-sets': '/lego/parts/3001/colors/4/sets/?page_size=3',

  'sets.list': '/lego/sets/?page_size=3&theme_id=158',
  'sets.get': '/lego/sets/75034-1/',
  'sets.alternates': '/lego/sets/30386-1/alternates/?page_size=3',
  'sets.minifigs': '/lego/sets/75034-1/minifigs/?page_size=3',
  'sets.parts': '/lego/sets/75034-1/parts/?page_size=3',
  'sets.parts.details': '/lego/sets/75034-1/parts/?page_size=3&inc_part_details=1',

  'themes.list': '/lego/themes/?page_size=3',
  'themes.get': '/lego/themes/158/',

  'errors.not-found': '/lego/sets/111-111/',
};

/** Sets that should contain other sets; the first non-empty one is saved as `sets.subsets`. */
const SUBSET_CANDIDATES = ['65771-1', '66708-1', '66456-1', 'K7140-1', '5004406-1'];

const apiKey = process.env.REBRICKABLE_API_KEY;
if (!apiKey) {
  console.error('REBRICKABLE_API_KEY is not set. Copy .env.example to .env and add your key.');
  process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (path: string): Promise<{ status: number; body: unknown }> => {
  await sleep(REQUEST_INTERVAL);
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json', Authorization: `key ${apiKey}` },
  });
  return { status: response.status, body: await response.json().catch(() => null) };
};

const save = async (name: string, path: string, status: number, body: unknown) => {
  const fixture = { request: path, status, captured: new Date().toISOString(), body };
  await writeFile(new URL(`${name}.json`, OUT_DIR), `${JSON.stringify(fixture, null, 2)}\n`);
};

await mkdir(OUT_DIR, { recursive: true });
const failures: string[] = [];

for (const [name, path] of Object.entries(CAPTURES)) {
  const { status, body } = await request(path);
  const expected = name === 'errors.not-found' ? status === 404 : status === 200;

  // Never overwrite a good fixture with an unexpected response
  if (expected) await save(name, path, status, body);
  console.log(`${expected ? 'ok  ' : 'FAIL'} ${status} ${name}`);
  if (!expected) failures.push(`${name} (${status})`);
}

let subsetsFound = false;
for (const setNum of SUBSET_CANDIDATES) {
  const path = `/lego/sets/${setNum}/sets/?page_size=3`;
  const { status, body } = await request(path);
  const count = (body as { count?: number } | null)?.count ?? 0;

  if (status === 200 && count > 0) {
    await save('sets.subsets', path, status, body);
    console.log(`ok   ${status} sets.subsets (${setNum})`);
    subsetsFound = true;
    break;
  }
}
if (!subsetsFound) failures.push('sets.subsets (no candidate set contained other sets)');

if (failures.length > 0) {
  console.error(`\n${failures.length} capture(s) need attention:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`\nSaved fixtures to ${OUT_DIR.pathname}`);

/**
 * Smoke-tests the built package in dist/ on the oldest supported Node (18),
 * which Vitest can't run on. Exercises both the ESM and CommonJS builds through
 * a fake fetch: requests, 404 errors, pagination, input checks and cancelling.
 *
 * Usage: yarn build && node scripts/smoke-dist.mjs
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const BASE = 'https://rebrickable.com/api/v3';
const require = createRequire(import.meta.url);

const builds = {
  esm: await import('../dist/index.js'),
  cjs: require('../dist/index.cjs'),
};

const fakeFetch = (responses) => {
  const urls = [];
  const fetch = async (input) => {
    urls.push(String(input));
    const next = responses.shift();
    if (!next) throw new Error(`Unexpected request: ${input}`);
    return new Response(JSON.stringify(next.body), { status: next.status ?? 200 });
  };
  return { fetch, urls };
};

for (const [format, { Rebrickable, RebrickableError }] of Object.entries(builds)) {
  const fake = fakeFetch([
    { body: { set_num: '75034-1' } },
    { status: 404, body: { detail: 'Not found.' } },
    {
      body: {
        count: 2,
        next: `${BASE}/lego/colors/?page=2&page_size=1000`,
        previous: null,
        results: [1],
      },
    },
    { body: { count: 2, next: null, previous: null, results: [2] } },
  ]);
  const rebrickable = new Rebrickable({
    apiKey: 'test',
    fetch: fake.fetch,
    minRequestInterval: 10,
  });

  assert.deepEqual(await rebrickable.sets.get('75034-1'), { set_num: '75034-1' });

  const notFound = await rebrickable.sets.get('111-111').catch((error) => error);
  assert.ok(notFound instanceof RebrickableError);
  assert.equal(notFound.status, 404);
  assert.equal(notFound.detail, 'Not found.');

  const all = [];
  for await (const color of rebrickable.colors.listAll()) all.push(color);
  assert.deepEqual(all, [1, 2]);

  await assert.rejects(rebrickable.sets.get(''), /set_num/);
  await assert.rejects(rebrickable.minifigs.list({ in_theme_id: '158,171' }), TypeError);

  const controller = new AbortController();
  const pending = rebrickable.themes
    .get(158, { signal: controller.signal })
    .catch((error) => error);
  controller.abort(new Error('cancelled'));
  assert.equal((await pending).message, 'cancelled');

  assert.deepEqual(fake.urls, [
    `${BASE}/lego/sets/75034-1/`,
    `${BASE}/lego/sets/111-111/`,
    `${BASE}/lego/colors/?page_size=1000`,
    `${BASE}/lego/colors/?page=2&page_size=1000`,
  ]);

  console.log(`ok ${format} build on Node ${process.version}`);
}

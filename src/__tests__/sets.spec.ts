import { describe, expect, it } from 'vitest';
import type { LegoSet } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';

const BASE = 'https://rebrickable.com/api/v3';

const deathStarTroopers: LegoSet = {
  set_num: '75034-1',
  name: 'Death Star Troopers',
  year: 2014,
  theme_id: 158,
  num_parts: 100,
  set_img_url: 'https://cdn.rebrickable.com/media/sets/75034-1.jpg',
  set_url: 'https://rebrickable.com/sets/75034-1/',
  last_modified_dt: '2014-01-01T00:00:00.000000Z',
};

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, sets: rebrickable.sets };
};

describe('SetsResource', () => {
  it('lists sets with filters', async () => {
    const { sets, urls } = setup({ body: page([deathStarTroopers]) });

    const data = await sets.list({ page_size: 1, min_year: 2002, search: 'Death Star' });

    expect(data.results).toEqual([deathStarTroopers]);
    expect(urls()).toEqual([`${BASE}/lego/sets/?page_size=1&min_year=2002&search=Death+Star`]);
  });

  it('iterates over every set across pages', async () => {
    const second = { ...deathStarTroopers, set_num: '75035-1' };
    const { sets } = setup(
      { body: page([deathStarTroopers], `${BASE}/lego/sets/?page=2&theme_id=158`) },
      { body: page([second]) },
    );

    const all: LegoSet[] = [];
    for await (const set of sets.listAll({ theme_id: 158 })) all.push(set);

    expect(all.map((s) => s.set_num)).toEqual(['75034-1', '75035-1']);
  });

  it('does not accept a page when iterating over every set', () => {
    const { sets } = setup();

    // @ts-expect-error listAll walks every page itself
    sets.listAll({ page: 2 });
  });

  it('gets a single set by set number', async () => {
    const { sets, urls } = setup({ body: deathStarTroopers });

    await expect(sets.get('75034-1')).resolves.toEqual(deathStarTroopers);
    expect(urls()).toEqual([`${BASE}/lego/sets/75034-1/`]);
  });

  it('rejects an empty set number without making a request', async () => {
    const { sets, fetch } = setup();

    await expect(sets.get('')).rejects.toThrow(/set_num/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['alternates', '/lego/sets/75034-1/alternates/?ordering=-year', { ordering: '-year' }],
    ['minifigs', '/lego/sets/75034-1/minifigs/?page=2', { page: 2 }],
    ['parts', '/lego/sets/75034-1/parts/?page_size=500', { page_size: 500 }],
    ['subsets', '/lego/sets/75034-1/sets/', {}],
  ] as const)('requests %s for a set', async (method, path, params) => {
    const { sets, urls } = setup({ body: page([]) });

    await sets[method]('75034-1', params);

    expect(urls()).toEqual([`${BASE}${path}`]);
  });

  it('sends inc_part_details as 1 when requested', async () => {
    const { sets, urls } = setup({ body: page([]) }, { body: page([]) });

    await sets.parts('75034-1', { inc_part_details: true });
    await sets.parts('75034-1', { inc_part_details: false });

    expect(urls()).toEqual([
      `${BASE}/lego/sets/75034-1/parts/?inc_part_details=1`,
      `${BASE}/lego/sets/75034-1/parts/`,
    ]);
  });
});

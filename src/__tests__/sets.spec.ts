import { describe, expect, it } from 'vitest';
import type { LegoSet } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import setsGet from './fixtures/sets.get.json';
import setsList from './fixtures/sets.list.json';
import setsPartsDetails from './fixtures/sets.parts.details.json';
import setsParts from './fixtures/sets.parts.json';
import setsSubsets from './fixtures/sets.subsets.json';

const BASE = 'https://rebrickable.com/api/v3';

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
    const { sets, urls } = setup({ body: setsList.body });

    const data = await sets.list({ page_size: 3, min_year: 2002, search: 'Death Star' });

    expect(data).toEqual(setsList.body);
    expect(urls()).toEqual([`${BASE}/lego/sets/?page_size=3&min_year=2002&search=Death+Star`]);
  });

  it('iterates over every set across pages', async () => {
    const [first, second] = setsList.body.results;
    const { sets } = setup(
      { body: page([first], `${BASE}/lego/sets/?page=2&theme_id=158`) },
      { body: page([second]) },
    );

    const all: LegoSet[] = [];
    for await (const set of sets.listAll({ theme_id: 158 })) all.push(set);

    expect(all).toEqual([first, second]);
  });

  it('does not accept a page when iterating over every set', () => {
    const { sets } = setup();

    // @ts-expect-error listAll walks every page itself
    sets.listAll({ page: 2 });
  });

  it('only accepts a numeric theme ID', async () => {
    const { sets, fetch } = setup();

    // @ts-expect-error theme_id is a number; a list like '158,171' is rejected
    await expect(sets.list({ theme_id: '158,171' })).rejects.toThrow(TypeError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('gets a single set by set number', async () => {
    const { sets, urls } = setup({ body: setsGet.body });

    await expect(sets.get('75034-1')).resolves.toEqual(setsGet.body);
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

  it('returns basic parts unless details are requested', async () => {
    const { sets, urls } = setup({ body: setsParts.body }, { body: setsPartsDetails.body });

    const basic = await sets.parts('75034-1');
    const detailed = await sets.parts('75034-1', { inc_part_details: true });

    // @ts-expect-error year_from is only typed when details are requested
    basic.results[0]?.part.year_from;
    expect(detailed.results[0]?.part.year_from).toEqual(expect.any(Number));
    expect(urls()).toEqual([
      `${BASE}/lego/sets/75034-1/parts/`,
      `${BASE}/lego/sets/75034-1/parts/?inc_part_details=1`,
    ]);
  });

  it('returns inventory items for the sets inside a set', async () => {
    const { sets } = setup({ body: setsSubsets.body });

    const data = await sets.subsets('65771-1');

    expect(data.results[0]).toEqual({
      id: expect.any(Number),
      set_num: expect.any(String),
      set_name: expect.any(String),
      quantity: expect.any(Number),
      set_img_url: expect.any(String),
    });
  });
});

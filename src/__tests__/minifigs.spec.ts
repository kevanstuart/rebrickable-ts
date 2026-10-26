import { describe, expect, it } from 'vitest';
import type { Minifig } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import minifigsGet from './fixtures/minifigs.get.json';
import minifigsList from './fixtures/minifigs.list.json';
import minifigsPartsDetails from './fixtures/minifigs.parts.details.json';
import minifigsParts from './fixtures/minifigs.parts.json';
import minifigsSets from './fixtures/minifigs.sets.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, minifigs: rebrickable.minifigs };
};

describe('MinifigsResource', () => {
  it('lists minifigs with filters', async () => {
    const { minifigs, urls } = setup({ body: minifigsList.body });

    const data = await minifigs.list({ in_theme_id: 158, search: 'trooper', page_size: 3 });

    expect(data).toEqual(minifigsList.body);
    expect(urls()).toEqual([`${BASE}/lego/minifigs/?in_theme_id=158&search=trooper&page_size=3`]);
  });

  it('iterates over every minifig with the maximum page size', async () => {
    const [first, second] = minifigsList.body.results;
    const { minifigs, urls } = setup(
      { body: page([first], `${BASE}/lego/minifigs/?in_set_num=30625-1&page=2&page_size=1000`) },
      { body: page([second]) },
    );

    const all: Minifig[] = [];
    for await (const minifig of minifigs.listAll({ in_set_num: '30625-1' })) all.push(minifig);

    expect(all).toEqual([first, second]);
    expect(urls()[0]).toBe(`${BASE}/lego/minifigs/?in_set_num=30625-1&page_size=1000`);
  });

  it('does not accept a page when iterating over every minifig', () => {
    const { minifigs } = setup();

    // @ts-expect-error listAll walks every page itself
    minifigs.listAll({ page: 2 });
  });

  it('gets a single minifig by its number', async () => {
    const { minifigs, urls } = setup({ body: minifigsGet.body });

    const minifig = await minifigs.get('fig-010697');

    expect(minifig).toEqual(minifigsGet.body);
    expect(urls()).toEqual([`${BASE}/lego/minifigs/fig-010697/`]);
  });

  it('rejects an empty minifig number without making a request', async () => {
    const { minifigs, fetch } = setup();

    await expect(minifigs.get('')).rejects.toThrow(/set_num/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns basic parts unless details are requested', async () => {
    const { minifigs, urls } = setup(
      { body: minifigsParts.body },
      { body: minifigsPartsDetails.body },
    );

    const basic = await minifigs.parts('fig-010697');
    const detailed = await minifigs.parts('fig-010697', { inc_part_details: true });

    expect(basic.results[0]?.set_num).toBe('fig-010697');
    // @ts-expect-error year_from is only typed when details are requested
    basic.results[0]?.part.year_from;
    expect(detailed.results[0]?.part.year_from).toEqual(expect.any(Number));
    expect(urls()).toEqual([
      `${BASE}/lego/minifigs/fig-010697/parts/`,
      `${BASE}/lego/minifigs/fig-010697/parts/?inc_part_details=1`,
    ]);
  });

  it('lists the sets a minifig appears in, which have no year or theme', async () => {
    const { minifigs, urls } = setup({ body: minifigsSets.body });

    const data = await minifigs.sets('fig-010697', { ordering: '-year' });

    expect(data.results[0]?.set_num).toBe('30625-1');
    expect(data.results[0]).not.toHaveProperty('year');
    // @ts-expect-error minifig sets have no year
    data.results[0]?.year;
    expect(urls()).toEqual([`${BASE}/lego/minifigs/fig-010697/sets/?ordering=-year`]);
  });
});

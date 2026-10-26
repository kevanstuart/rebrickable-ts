import { describe, expect, it } from 'vitest';
import type { Part, PartDetails } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import partsColor from './fixtures/parts.color.json';
import partsColorSets from './fixtures/parts.color-sets.json';
import partsColors from './fixtures/parts.colors.json';
import partsGet from './fixtures/parts.get.json';
import partsGetPrinted from './fixtures/parts.get.printed.json';
import partsListDetails from './fixtures/parts.list.details.json';
import partsList from './fixtures/parts.list.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, parts: rebrickable.parts };
};

describe('PartsResource', () => {
  describe('list', () => {
    it('lists parts with filters', async () => {
      const { parts, urls } = setup({ body: partsList.body });

      const data = await parts.list({ part_cat_id: 11, search: '2 x 4', page_size: 3 });

      expect(data).toEqual(partsList.body);
      expect(urls()).toEqual([`${BASE}/lego/parts/?part_cat_id=11&search=2+x+4&page_size=3`]);
    });

    it('sends part_nums comma-separated and leaves an empty list out', async () => {
      const { parts, urls } = setup({ body: page([]) }, { body: page([]) });

      await parts.list({ part_nums: ['3001', '3002'] });
      await parts.list({ part_nums: [] });

      expect(urls()).toEqual([`${BASE}/lego/parts/?part_nums=3001%2C3002`, `${BASE}/lego/parts/`]);
    });

    it('returns basic parts unless details are requested', async () => {
      const { parts, urls } = setup({ body: partsList.body }, { body: partsListDetails.body });

      const basic = await parts.list({ part_cat_id: 11 });
      const detailed = await parts.list({ part_cat_id: 11, inc_part_details: true });

      // @ts-expect-error year_from is only typed when details are requested
      basic.results[0]?.year_from;
      expect(detailed.results[0]?.year_from).toEqual(expect.any(Number));
      expect(urls()).toEqual([
        `${BASE}/lego/parts/?part_cat_id=11`,
        `${BASE}/lego/parts/?part_cat_id=11&inc_part_details=1`,
      ]);
    });
  });

  it('only accepts numeric category and color IDs', async () => {
    const { parts, fetch } = setup();

    // @ts-expect-error part_cat_id is a number
    await expect(parts.list({ part_cat_id: '11' })).rejects.toThrow(TypeError);
    // @ts-expect-error color_id is a number; Rebrickable would ignore '4,0' and return every part
    await expect(parts.list({ color_id: '4,0' })).rejects.toThrow(TypeError);
    expect(fetch).not.toHaveBeenCalled();
  });

  describe('listAll', () => {
    it('iterates over every part with the maximum page size', async () => {
      const [first, second] = partsList.body.results;
      const { parts, urls } = setup(
        { body: page([first], `${BASE}/lego/parts/?page=2&page_size=1000&part_cat_id=11`) },
        { body: page([second]) },
      );

      const all: Part[] = [];
      for await (const part of parts.listAll({ part_cat_id: 11 })) all.push(part);

      expect(all).toEqual([first, second]);
      expect(urls()[0]).toBe(`${BASE}/lego/parts/?part_cat_id=11&page_size=1000`);
    });

    it('yields part details when requested', async () => {
      // The fixture is page 1 of many, so serve its results as the only page
      const { parts } = setup({ body: page(partsListDetails.body.results) });

      const all: PartDetails[] = [];
      for await (const part of parts.listAll({ inc_part_details: true })) all.push(part);

      expect(all[0]?.print_of).toBeDefined();
    });

    it('does not accept a page', () => {
      const { parts } = setup();

      // @ts-expect-error listAll walks every page itself
      parts.listAll({ page: 2 });
    });
  });

  describe('get', () => {
    it('gets a part with its full details', async () => {
      const { parts, urls } = setup({ body: partsGet.body });

      const part = await parts.get('3001');

      expect(part).toEqual(partsGet.body);
      expect(part.molds.length).toBeGreaterThan(0);
      expect(urls()).toEqual([`${BASE}/lego/parts/3001/`]);
    });

    it('gets a printed part, which points to its unprinted part', async () => {
      const { parts } = setup({ body: partsGetPrinted.body });

      const part = await parts.get('3005pr0025');

      expect(part.print_of).toBe('3005');
    });

    it('rejects an empty part number without making a request', async () => {
      const { parts, fetch } = setup();

      await expect(parts.get('')).rejects.toThrow(/part_num/);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('colors', () => {
    it('lists the colors a part has appeared in', async () => {
      const { parts, urls } = setup({ body: partsColors.body });

      const data = await parts.colors('3001', { page_size: 3 });

      expect(data.results[0]).toMatchObject({ color_id: 0, color_name: 'Black' });
      expect(urls()).toEqual([`${BASE}/lego/parts/3001/colors/?page_size=3`]);
    });

    it('gets the details of a part in one color', async () => {
      const { parts, urls } = setup({ body: partsColor.body });

      const details = await parts.color('3001', 4);

      expect(details.year_from).toEqual(expect.any(Number));
      expect(urls()).toEqual([`${BASE}/lego/parts/3001/colors/4/`]);
    });

    it('keeps color ID 0 (Black) in the path', async () => {
      const { parts, urls } = setup({ body: partsColor.body }, { body: page([]) });

      await parts.color('3001', 0);
      await parts.colorSets('3001', 0);

      expect(urls()).toEqual([
        `${BASE}/lego/parts/3001/colors/0/`,
        `${BASE}/lego/parts/3001/colors/0/sets/`,
      ]);
    });

    it('lists the sets that use a part in one color', async () => {
      const { parts, urls } = setup({ body: partsColorSets.body });

      const data = await parts.colorSets('3001', 4, { ordering: '-year', page_size: 3 });

      expect(data).toEqual(partsColorSets.body);
      expect(urls()).toEqual([`${BASE}/lego/parts/3001/colors/4/sets/?ordering=-year&page_size=3`]);
    });
  });
});

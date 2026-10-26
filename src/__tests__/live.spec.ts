import { beforeAll, describe, expect, it } from 'vitest';
import { Rebrickable, RebrickableError } from '..';

const apiKey = process.env.REBRICKABLE_API_KEY;

/**
 * Hits the real Rebrickable API.
 * With great API keys comes great responsibility.
 *
 * Every resource lives in this one file so all requests share one client,
 * and so one rate limit. Separate files would run in parallel and could
 * exceed Rebrickable's one request per second.
 */
describe.skipIf(!apiKey)('live API', { timeout: 30_000 }, () => {
  let rebrickable: Rebrickable;

  beforeAll(() => {
    rebrickable = new Rebrickable({ apiKey: apiKey ?? '' });
  });

  describe('colors', () => {
    it('gets a color by ID', async () => {
      const color = await rebrickable.colors.get(4);

      expect(color).toMatchObject({ id: 4, name: 'Red', is_trans: false });
    });

    it('lists colors', async () => {
      const colors = await rebrickable.colors.list({ page_size: 5 });

      expect(colors.count).toBeGreaterThan(0);
      expect(colors.results).toHaveLength(5);
    });
  });

  describe('elements', () => {
    it('gets an element by element ID', async () => {
      const element = await rebrickable.elements.get('4244370');

      expect(element).toMatchObject({
        element_id: '4244370',
        design_id: '50746',
        part: { part_num: '54200', year_from: expect.any(Number) },
        color: { id: 15, name: 'White' },
      });
    });
  });

  describe('minifigs', () => {
    it('gets a minifig by its number', async () => {
      const minifig = await rebrickable.minifigs.get('fig-010697');

      expect(minifig).toMatchObject({ set_num: 'fig-010697', num_parts: expect.any(Number) });
    });

    it('lists the parts of a minifig', async () => {
      const parts = await rebrickable.minifigs.parts('fig-010697');

      expect(parts.count).toBe(4);
      expect(parts.results[0]?.set_num).toBe('fig-010697');
    });

    it('lists the sets a minifig appears in', async () => {
      const sets = await rebrickable.minifigs.sets('fig-010697');

      expect(sets.results.map((s) => s.set_num)).toContain('30625-1');
    });
  });

  describe('part categories', () => {
    it('gets a part category by ID', async () => {
      const category = await rebrickable.partCategories.get(11);

      expect(category).toMatchObject({ id: 11, name: 'Bricks', part_count: expect.any(Number) });
    });

    it('lists part categories', async () => {
      const categories = await rebrickable.partCategories.list({ page_size: 5 });

      expect(categories.count).toBeGreaterThan(0);
      expect(categories.results).toHaveLength(5);
    });
  });

  describe('parts', () => {
    it('gets a part with its full details', async () => {
      const part = await rebrickable.parts.get('3001');

      expect(part).toMatchObject({ part_num: '3001', print_of: null });
      expect(part.molds.length).toBeGreaterThan(0);
    });

    it('lists several parts by part number', async () => {
      const parts = await rebrickable.parts.list({ part_nums: ['3001', '3002'] });

      expect(parts.results.map((p) => p.part_num).sort()).toEqual(['3001', '3002']);
    });

    it('lists the colors of a part and gets one color', async () => {
      const colors = await rebrickable.parts.colors('3001', { page_size: 3 });
      const red = await rebrickable.parts.color('3001', 4);

      expect(colors.count).toBeGreaterThan(0);
      expect(red).toMatchObject({ year_from: expect.any(Number), elements: expect.any(Array) });
    });
  });

  describe('themes', () => {
    it('gets a theme by ID', async () => {
      const theme = await rebrickable.themes.get(158);

      expect(theme).toEqual({ id: 158, parent_id: null, name: 'Star Wars' });
    });

    it('lists themes', async () => {
      const themes = await rebrickable.themes.list({ page_size: 5 });

      expect(themes.count).toBeGreaterThan(0);
      expect(themes.results).toHaveLength(5);
    });
  });

  describe('sets', () => {
    it('gets a set by set number', async () => {
      const set = await rebrickable.sets.get('75034-1');

      expect(set).toMatchObject({ set_num: '75034-1', name: expect.any(String) });
      expect(typeof set.last_modified_dt).toBe('string');
    });

    it('returns a 404 RebrickableError for an unknown set', async () => {
      const error = await rebrickable.sets.get('111-111').catch((e: unknown) => e);

      expect(error).toBeInstanceOf(RebrickableError);
      expect(error).toMatchObject({ status: 404 });
    });

    it('lists the parts in a set', async () => {
      const parts = await rebrickable.sets.parts('75034-1', { page_size: 5 });

      expect(parts.count).toBeGreaterThan(0);
      expect(parts.results[0]).toMatchObject({
        set_num: '75034-1',
        quantity: expect.any(Number),
      });
    });
  });
});

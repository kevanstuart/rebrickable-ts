import { describe, expect, it } from 'vitest';
import type { Color } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import colorsGet from './fixtures/colors.get.json';
import colorsList from './fixtures/colors.list.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, colors: rebrickable.colors };
};

describe('ColorsResource', () => {
  it('lists colors with paging and ordering', async () => {
    const { colors, urls } = setup({ body: colorsList.body });

    const data = await colors.list({ page: 2, page_size: 3, ordering: '-name' });

    expect(data).toEqual(colorsList.body);
    expect(urls()).toEqual([`${BASE}/lego/colors/?page=2&page_size=3&ordering=-name`]);
  });

  it('iterates over every color across pages', async () => {
    const [first, second] = colorsList.body.results;
    const { colors, urls } = setup(
      { body: page([first], `${BASE}/lego/colors/?page=2&page_size=1000`) },
      { body: page([second]) },
    );

    const all: Color[] = [];
    for await (const color of colors.listAll()) all.push(color);

    expect(all).toEqual([first, second]);
    expect(urls()).toEqual([
      `${BASE}/lego/colors/?page_size=1000`,
      `${BASE}/lego/colors/?page=2&page_size=1000`,
    ]);
  });

  it('does not accept a page when iterating over every color', () => {
    const { colors } = setup();

    // @ts-expect-error listAll walks every page itself
    colors.listAll({ page: 2 });
  });

  it('gets a single color by ID', async () => {
    const { colors, urls } = setup({ body: colorsGet.body });

    await expect(colors.get(4)).resolves.toEqual(colorsGet.body);
    expect(urls()).toEqual([`${BASE}/lego/colors/4/`]);
  });

  it('gets the "[Unknown]" color, which has a negative ID', async () => {
    const { colors, urls } = setup({ body: colorsList.body.results[0] });

    const unknown = await colors.get(-1);

    expect(unknown.name).toBe('[Unknown]');
    expect(urls()).toEqual([`${BASE}/lego/colors/-1/`]);
  });
});

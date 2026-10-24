import { describe, expect, it } from 'vitest';
import type { Theme } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import themesGet from './fixtures/themes.get.json';
import themesList from './fixtures/themes.list.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, themes: rebrickable.themes };
};

describe('ThemesResource', () => {
  it('lists themes with paging and ordering', async () => {
    const { themes, urls } = setup({ body: themesList.body });

    const data = await themes.list({ page: 2, page_size: 3, ordering: 'name' });

    expect(data).toEqual(themesList.body);
    expect(urls()).toEqual([`${BASE}/lego/themes/?page=2&page_size=3&ordering=name`]);
  });

  it('iterates over every theme across pages', async () => {
    const [first, second] = themesList.body.results;
    const { themes, urls } = setup(
      { body: page([first], `${BASE}/lego/themes/?page=2&page_size=1000`) },
      { body: page([second]) },
    );

    const all: Theme[] = [];
    for await (const theme of themes.listAll()) all.push(theme);

    expect(all).toEqual([first, second]);
    expect(urls()).toEqual([
      `${BASE}/lego/themes/?page_size=1000`,
      `${BASE}/lego/themes/?page=2&page_size=1000`,
    ]);
  });

  it('does not accept a page when iterating over every theme', () => {
    const { themes } = setup();

    // @ts-expect-error listAll walks every page itself
    themes.listAll({ page: 2 });
  });

  it('gets a single theme by ID', async () => {
    const { themes, urls } = setup({ body: themesGet.body });

    await expect(themes.get(158)).resolves.toEqual(themesGet.body);
    expect(urls()).toEqual([`${BASE}/lego/themes/158/`]);
  });
});

import { describe, expect, it } from 'vitest';
import type { PartCategory } from '../models';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch, page } from './fake-fetch';
import partCategoriesGet from './fixtures/part-categories.get.json';
import partCategoriesList from './fixtures/part-categories.list.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, partCategories: rebrickable.partCategories };
};

describe('PartCategoriesResource', () => {
  it('lists part categories with paging and ordering', async () => {
    const { partCategories, urls } = setup({ body: partCategoriesList.body });

    const data = await partCategories.list({ page: 2, page_size: 3, ordering: '-part_count' });

    expect(data).toEqual(partCategoriesList.body);
    expect(urls()).toEqual([
      `${BASE}/lego/part_categories/?page=2&page_size=3&ordering=-part_count`,
    ]);
  });

  it('iterates over every part category across pages', async () => {
    const [first, second] = partCategoriesList.body.results;
    const { partCategories, urls } = setup(
      { body: page([first], `${BASE}/lego/part_categories/?page=2&page_size=1000`) },
      { body: page([second]) },
    );

    const all: PartCategory[] = [];
    for await (const category of partCategories.listAll()) all.push(category);

    expect(all).toEqual([first, second]);
    expect(urls()).toEqual([
      `${BASE}/lego/part_categories/?page_size=1000`,
      `${BASE}/lego/part_categories/?page=2&page_size=1000`,
    ]);
  });

  it('does not accept a page when iterating over every part category', () => {
    const { partCategories } = setup();

    // @ts-expect-error listAll walks every page itself
    partCategories.listAll({ page: 2 });
  });

  it('gets a single part category by ID', async () => {
    const { partCategories, urls } = setup({ body: partCategoriesGet.body });

    await expect(partCategories.get(11)).resolves.toEqual(partCategoriesGet.body);
    expect(urls()).toEqual([`${BASE}/lego/part_categories/11/`]);
  });
});

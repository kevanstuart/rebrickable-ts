import { describe, expect, it } from 'vitest';
import { Rebrickable } from '../rebrickable';
import { createFakeFetch } from './fake-fetch';
import elementsGet from './fixtures/elements.get.json';

const BASE = 'https://rebrickable.com/api/v3';

const setup = (...responses: Parameters<typeof createFakeFetch>) => {
  const fake = createFakeFetch(...responses);
  const rebrickable = new Rebrickable({
    apiKey: 'test-key',
    fetch: fake.fetch,
    minRequestInterval: 0,
  });
  return { ...fake, elements: rebrickable.elements };
};

describe('ElementsResource', () => {
  it('gets a single element by element ID', async () => {
    const { elements, urls } = setup({ body: elementsGet.body });

    await expect(elements.get('4244370')).resolves.toEqual(elementsGet.body);
    expect(urls()).toEqual([`${BASE}/lego/elements/4244370/`]);
  });

  it('returns the full part details and color', async () => {
    const { elements } = setup({ body: elementsGet.body });

    const element = await elements.get('4244370');

    // Only compiles because Element.part is PartDetails, not the basic Part
    expect(element.part.year_from).toEqual(expect.any(Number));
    expect(element.part.print_of).toBeNull();
    expect(element.color).toMatchObject({ id: 15, name: 'White' });
  });

  it('rejects an empty element ID without making a request', async () => {
    const { elements, fetch } = setup();

    await expect(elements.get('')).rejects.toThrow(/element_id/);
    expect(fetch).not.toHaveBeenCalled();
  });
});

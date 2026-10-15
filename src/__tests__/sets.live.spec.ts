import { beforeAll, describe, expect, it } from 'vitest';
import { Rebrickable, RebrickableError } from '..';

const apiKey = process.env.REBRICKABLE_API_KEY;

/**
 * Hits the real Rebrickable API.
 * With great API keys comes great responsibility.
 */
describe.skipIf(!apiKey)('Sets (live API)', { timeout: 30_000 }, () => {
  let rebrickable: Rebrickable;

  beforeAll(() => {
    rebrickable = new Rebrickable({ apiKey: apiKey ?? '' });
  });

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
    expect(parts.results[0]).toMatchObject({ set_num: '75034-1', quantity: expect.any(Number) });
  });
});

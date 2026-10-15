import { describe, expect, it } from 'vitest';
import type {
  APIResourceList,
  LegoSet,
  PartDetails,
  SetAlternate,
  SetInventoryItem,
  SetMinifig,
  SetPart,
} from '../models';
import setsAlternates from './fixtures/sets.alternates.json';
import setsGet from './fixtures/sets.get.json';
import setsList from './fixtures/sets.list.json';
import setsMinifigs from './fixtures/sets.minifigs.json';
import setsPartsDetails from './fixtures/sets.parts.details.json';
import setsParts from './fixtures/sets.parts.json';
import setsSubsets from './fixtures/sets.subsets.json';

/**
 * Checks that the models match real API responses captured by `yarn fixtures`.
 * The typed assignments are the real test: if a model claims a field the API
 * doesn't send, or types it differently, `yarn typecheck` fails.
 */
describe('models match captured API responses', () => {
  it('sets', () => {
    const checked: unknown[] = [
      setsGet.body satisfies LegoSet,
      setsList.body satisfies APIResourceList<LegoSet>,
      setsAlternates.body satisfies APIResourceList<SetAlternate>,
      setsMinifigs.body satisfies APIResourceList<SetMinifig>,
      setsParts.body satisfies APIResourceList<SetPart>,
      setsPartsDetails.body satisfies APIResourceList<SetPart<PartDetails>>,
      setsSubsets.body satisfies APIResourceList<SetInventoryItem>,
    ];

    expect(checked).not.toContain(undefined);
  });

  it('fixtures without details do not include the detail-only part fields', () => {
    const [line] = setsParts.body.results;

    expect(line?.part).not.toHaveProperty('year_from');
    expect(line?.part).not.toHaveProperty('print_of');
  });
});

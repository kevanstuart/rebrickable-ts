import { describe, expect, it } from 'vitest';
import type {
  APIResourceList,
  Color,
  Element,
  LegoSet,
  PartCategory,
  PartDetails,
  SetAlternate,
  SetInventoryItem,
  SetMinifig,
  SetPart,
  Theme,
} from '../models';
import colorsGet from './fixtures/colors.get.json';
import colorsList from './fixtures/colors.list.json';
import elementsGet from './fixtures/elements.get.json';
import partCategoriesGet from './fixtures/part-categories.get.json';
import partCategoriesList from './fixtures/part-categories.list.json';
import setsAlternates from './fixtures/sets.alternates.json';
import setsGet from './fixtures/sets.get.json';
import setsList from './fixtures/sets.list.json';
import setsMinifigs from './fixtures/sets.minifigs.json';
import setsPartsDetails from './fixtures/sets.parts.details.json';
import setsParts from './fixtures/sets.parts.json';
import setsSubsets from './fixtures/sets.subsets.json';
import themesGet from './fixtures/themes.get.json';
import themesList from './fixtures/themes.list.json';

/**
 * Checks that the models match real API responses captured by `yarn fixtures`.
 * The typed assignments are the real test: if a model claims a field the API
 * doesn't send, or types it differently, `yarn typecheck` fails.
 */
describe('models match captured API responses', () => {
  it('colors', () => {
    const checked: unknown[] = [
      colorsGet.body satisfies Color,
      colorsList.body satisfies APIResourceList<Color>,
    ];

    expect(checked).not.toContain(undefined);
  });

  it('elements', () => {
    const checked: unknown[] = [elementsGet.body satisfies Element];

    expect(checked).not.toContain(undefined);
  });

  it('part categories', () => {
    const checked: unknown[] = [
      partCategoriesGet.body satisfies PartCategory,
      partCategoriesList.body satisfies APIResourceList<PartCategory>,
    ];

    expect(checked).not.toContain(undefined);
  });

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

  it('themes', () => {
    const checked: unknown[] = [
      themesGet.body satisfies Theme,
      themesList.body satisfies APIResourceList<Theme>,
    ];

    expect(checked).not.toContain(undefined);
  });

  it('fixtures without details do not include the detail-only part fields', () => {
    const [line] = setsParts.body.results;

    expect(line?.part).not.toHaveProperty('year_from');
    expect(line?.part).not.toHaveProperty('print_of');
  });
});

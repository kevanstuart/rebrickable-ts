import { type ClientOptions, HttpClient } from './http/client';
import { ColorsResource } from './resources/colors';
import { ElementsResource } from './resources/elements';
import { PartCategoriesResource } from './resources/part-categories';
import { PartsResource } from './resources/parts';
import { SetsResource } from './resources/sets';
import { ThemesResource } from './resources/themes';

/**
 * Entry point for the Rebrickable API.
 *
 * @example
 * ```ts
 * const rebrickable = new Rebrickable({ apiKey: process.env.REBRICKABLE_API_KEY });
 * const set = await rebrickable.sets.get('75034-1');
 * ```
 */
export class Rebrickable {
  readonly colors: ColorsResource;
  readonly elements: ElementsResource;
  readonly partCategories: PartCategoriesResource;
  readonly parts: PartsResource;
  readonly sets: SetsResource;
  readonly themes: ThemesResource;

  constructor(options: ClientOptions) {
    const http = new HttpClient(options);

    this.colors = new ColorsResource(http);
    this.elements = new ElementsResource(http);
    this.partCategories = new PartCategoriesResource(http);
    this.parts = new PartsResource(http);
    this.sets = new SetsResource(http);
    this.themes = new ThemesResource(http);
  }
}

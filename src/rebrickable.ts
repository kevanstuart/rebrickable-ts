import { type ClientOptions, HttpClient } from './http/client';
import { SetsResource } from './resources/sets';

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
  readonly sets: SetsResource;

  constructor(options: ClientOptions) {
    const http = new HttpClient(options);

    this.sets = new SetsResource(http);
  }
}

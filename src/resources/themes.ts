import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type { AllPagesInput, APIResourceList, ListThemesInput, Theme } from '../models';

/**
 * Themes, such as Star Wars or Technic. Sub-themes point to their parent
 * through `parent_id`.
 */
export class ThemesResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get one page of themes */
  async list(
    params: ListThemesInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<Theme>> {
    return this.#http.get(ENDPOINTS.THEMES.BASE, { ...options, query: params });
  }

  /**
   * Iterate over every theme, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum, to keep the number of requests low.
   */
  listAll(
    params: AllPagesInput<ListThemesInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<Theme> {
    return this.#http.paginate(ENDPOINTS.THEMES.BASE, { ...options, query: params });
  }

  /** Get a single theme by its Rebrickable ID, e.g. `158` for Star Wars */
  async get(id: number, options: CallOptions = {}): Promise<Theme> {
    return this.#http.get(buildPath(ENDPOINTS.THEMES.DETAIL, { id }), options);
  }
}

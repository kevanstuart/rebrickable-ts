import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type { AllPagesInput, APIResourceList, Color, ListColorsInput } from '../models';

/**
 * Colors, with their IDs in other systems such as BrickLink and LEGO.
 */
export class ColorsResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get one page of colors */
  async list(
    params: ListColorsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<Color>> {
    return this.#http.get(ENDPOINTS.COLORS.BASE, { ...options, query: params });
  }

  /**
   * Iterate over every color, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum, to keep the number of requests low.
   */
  listAll(
    params: AllPagesInput<ListColorsInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<Color> {
    return this.#http.paginate(ENDPOINTS.COLORS.BASE, { ...options, query: params });
  }

  /** Get a single color by its Rebrickable ID, e.g. `4` for Red */
  async get(id: number, options: CallOptions = {}): Promise<Color> {
    return this.#http.get(buildPath(ENDPOINTS.COLORS.DETAIL, { id }), options);
  }
}

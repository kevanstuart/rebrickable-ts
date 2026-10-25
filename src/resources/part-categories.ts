import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type {
  AllPagesInput,
  APIResourceList,
  ListPartCategoriesInput,
  PartCategory,
} from '../models';

/**
 * Part categories, such as Bricks or Plates. Parts reference their
 * category through `part_cat_id`.
 */
export class PartCategoriesResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get one page of part categories */
  async list(
    params: ListPartCategoriesInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<PartCategory>> {
    return this.#http.get(ENDPOINTS.PART_CATEGORIES.BASE, { ...options, query: params });
  }

  /**
   * Iterate over every part category, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum, to keep the number of requests low.
   */
  listAll(
    params: AllPagesInput<ListPartCategoriesInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<PartCategory> {
    return this.#http.paginate(ENDPOINTS.PART_CATEGORIES.BASE, { ...options, query: params });
  }

  /** Get a single part category by its Rebrickable ID, e.g. `11` for Bricks */
  async get(id: number, options: CallOptions = {}): Promise<PartCategory> {
    return this.#http.get(buildPath(ENDPOINTS.PART_CATEGORIES.DETAIL, { id }), options);
  }
}

import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type {
  AllPagesInput,
  APIResourceList,
  LegoSet,
  ListSetsInput,
  PartDetails,
  SetAlternate,
  SetAlternatesInput,
  SetInventoryItem,
  SetMinifig,
  SetMinifigsInput,
  SetPart,
  SetPartsInput,
  SetSubsetsInput,
} from '../models';

/**
 * Sets, and the inventories attached to a set.
 */
export class SetsResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get one page of sets, optionally filtered */
  async list(
    params: ListSetsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<LegoSet>> {
    return this.#http.get(ENDPOINTS.SETS.BASE, { ...options, query: params });
  }

  /**
   * Iterate over every set matching the filters, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum, to keep the number of requests low.
   */
  listAll(
    params: AllPagesInput<ListSetsInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<LegoSet> {
    return this.#http.paginate(ENDPOINTS.SETS.BASE, { ...options, query: params });
  }

  /** Get a single set, e.g. `75034-1` */
  async get(setNum: string, options: CallOptions = {}): Promise<LegoSet> {
    return this.#http.get(buildPath(ENDPOINTS.SETS.DETAIL, { set_num: setNum }), options);
  }

  /** MOCs that can be built entirely from the parts in this set */
  async alternates(
    setNum: string,
    params: SetAlternatesInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<SetAlternate>> {
    return this.#http.get(buildPath(ENDPOINTS.SETS.ALTERNATES, { set_num: setNum }), {
      ...options,
      query: params,
    });
  }

  /** Minifigs in this set's inventory */
  async minifigs(
    setNum: string,
    params: SetMinifigsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<SetMinifig>> {
    return this.#http.get(buildPath(ENDPOINTS.SETS.MINIFIGS, { set_num: setNum }), {
      ...options,
      query: params,
    });
  }

  /**
   * Parts in this set's inventory. Pass `inc_part_details: true` to get
   * each part's full details.
   */
  parts(
    setNum: string,
    params: SetPartsInput & { inc_part_details: true },
    options?: CallOptions,
  ): Promise<APIResourceList<SetPart<PartDetails>>>;
  parts(
    setNum: string,
    params?: SetPartsInput,
    options?: CallOptions,
  ): Promise<APIResourceList<SetPart>>;
  async parts(
    setNum: string,
    params: SetPartsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<SetPart>> {
    return this.#http.get(buildPath(ENDPOINTS.SETS.PARTS, { set_num: setNum }), {
      ...options,
      query: params,
    });
  }

  /** Sets included in this set's inventory, e.g. the sets inside a bundle */
  async subsets(
    setNum: string,
    params: SetSubsetsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<SetInventoryItem>> {
    return this.#http.get(buildPath(ENDPOINTS.SETS.SETS, { set_num: setNum }), {
      ...options,
      query: params,
    });
  }
}

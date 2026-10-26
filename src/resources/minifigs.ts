import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type {
  AllPagesInput,
  APIResourceList,
  ListMinifigsInput,
  Minifig,
  MinifigPart,
  MinifigPartsInput,
  MinifigSet,
  MinifigSetsInput,
  PartDetails,
  WithDetails,
} from '../models';

/**
 * Minifigs, their part inventories, and the sets they appear in.
 * Minifigs are identified by numbers like `fig-010697`.
 */
export class MinifigsResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get one page of minifigs, optionally filtered */
  async list(
    params: ListMinifigsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<Minifig>> {
    return this.#http.get(ENDPOINTS.MINIFIGS.BASE, { ...options, query: params });
  }

  /**
   * Iterate over every minifig matching the filters, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum, to keep the number of requests low.
   */
  listAll(
    params: AllPagesInput<ListMinifigsInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<Minifig> {
    return this.#http.paginate(ENDPOINTS.MINIFIGS.BASE, { ...options, query: params });
  }

  /** Get a single minifig, e.g. `fig-010697` */
  async get(figNum: string, options: CallOptions = {}): Promise<Minifig> {
    return this.#http.get(buildPath(ENDPOINTS.MINIFIGS.DETAIL, { set_num: figNum }), options);
  }

  /**
   * Parts in this minifig's inventory. Pass `inc_part_details: true` to get
   * each part's full details.
   */
  parts(
    figNum: string,
    params: WithDetails<MinifigPartsInput>,
    options?: CallOptions,
  ): Promise<APIResourceList<MinifigPart<PartDetails>>>;
  parts(
    figNum: string,
    params?: MinifigPartsInput,
    options?: CallOptions,
  ): Promise<APIResourceList<MinifigPart>>;
  async parts(
    figNum: string,
    params: MinifigPartsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<MinifigPart>> {
    return this.#http.get(buildPath(ENDPOINTS.MINIFIGS.PARTS, { set_num: figNum }), {
      ...options,
      query: params,
    });
  }

  /** Sets this minifig has appeared in */
  async sets(
    figNum: string,
    params: MinifigSetsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<MinifigSet>> {
    return this.#http.get(buildPath(ENDPOINTS.MINIFIGS.SETS, { set_num: figNum }), {
      ...options,
      query: params,
    });
  }
}

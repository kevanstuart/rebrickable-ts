import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type {
  AllPagesInput,
  APIResourceList,
  LegoSet,
  ListPartsInput,
  Part,
  PartColor,
  PartColorDetails,
  PartColorSetsInput,
  PartColorsInput,
  PartDetails,
  WithDetails,
} from '../models';

/**
 * Parts, the colors each part comes in, and the sets that use a part in a color.
 */
export class PartsResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /**
   * Get one page of parts, optionally filtered. Pass `inc_part_details: true`
   * to get each part's full details.
   */
  list(
    params: WithDetails<ListPartsInput>,
    options?: CallOptions,
  ): Promise<APIResourceList<PartDetails>>;
  list(params?: ListPartsInput, options?: CallOptions): Promise<APIResourceList<Part>>;
  async list(
    params: ListPartsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<Part>> {
    return this.#http.get(ENDPOINTS.PARTS.BASE, { ...options, query: toQuery(params) });
  }

  /**
   * Iterate over every part matching the filters, fetching pages as needed.
   * `page_size` defaults to 1000, the maximum. Without filters this walks the
   * whole catalogue, which takes about a minute at the rate limit.
   */
  listAll(
    params: WithDetails<AllPagesInput<ListPartsInput>>,
    options?: CallOptions,
  ): AsyncGenerator<PartDetails>;
  listAll(params?: AllPagesInput<ListPartsInput>, options?: CallOptions): AsyncGenerator<Part>;
  listAll(
    params: AllPagesInput<ListPartsInput> = {},
    options: CallOptions = {},
  ): AsyncGenerator<Part> {
    return this.#http.paginate(ENDPOINTS.PARTS.BASE, { ...options, query: toQuery(params) });
  }

  /** Get a single part with its full details, e.g. `3001` */
  async get(partNum: string, options: CallOptions = {}): Promise<PartDetails> {
    return this.#http.get(buildPath(ENDPOINTS.PARTS.DETAIL, { part_num: partNum }), options);
  }

  /** Colors this part has appeared in */
  async colors(
    partNum: string,
    params: PartColorsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<PartColor>> {
    return this.#http.get(buildPath(ENDPOINTS.PARTS.COLORS, { part_num: partNum }), {
      ...options,
      query: params,
    });
  }

  /** Details of this part in one color, such as the years it was made */
  async color(
    partNum: string,
    colorId: number,
    options: CallOptions = {},
  ): Promise<PartColorDetails> {
    return this.#http.get(
      buildPath(ENDPOINTS.PARTS.COLOR_DETAIL, { part_num: partNum, color_id: colorId }),
      options,
    );
  }

  /** Sets that include this part in this color */
  async colorSets(
    partNum: string,
    colorId: number,
    params: PartColorSetsInput = {},
    options: CallOptions = {},
  ): Promise<APIResourceList<LegoSet>> {
    return this.#http.get(
      buildPath(ENDPOINTS.PARTS.COLOR_SETS, { part_num: partNum, color_id: colorId }),
      { ...options, query: params },
    );
  }
}

/** `part_nums` is sent as a comma-separated list; an empty list is left out */
const toQuery = ({ part_nums, ...rest }: AllPagesInput<ListPartsInput>) => ({
  ...rest,
  part_nums: part_nums?.length ? part_nums.join(',') : undefined,
});

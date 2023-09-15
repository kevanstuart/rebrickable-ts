/**
 * Calling any API endpoint that should return a list of items will return a paginated object with
 * the total count, a next url, a previous url and the results.
 */
export interface APIListResponse<Data> {
  /** The total number of resources available from this API */
  count: number
  /** The URL for the next page in the list */
  next: string | null
  /** The URL for the previous page in the list */
  previous: string | null
  /** A list of named API resources */
  results: Data[]
}

/**
 * Converting any api parameters into a valid URL requires a Rebrickable endpoint,
 * optional identifiers (e.g set number, part number, etc) and a number of filters
 * or sorting arguments.
 *
 *                                     Identifier (set_num)
 *                                          |___|
 * https://rebrickable.com/api/v3/lego/sets/75212/minifigs/?page=1&page_size=100
 * |_____________________________|________________________|____________________|
 *               |                            |                      |
  *         The base URL                The endpoint             Parameters
 */
export interface ApiUrlOptions {
  /** The rebrickable endpoint starting from after the version number */
  endpoint: string
  /** The object holding any identifiers to replace in the endpoint */
  identifiers?: Record<string, string | number>
  /** The object containing any filter / sorting parameters to append as a querystring */
  parameters?: Record<string, string>
}

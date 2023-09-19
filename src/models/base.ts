/**
 * Calling any API endpoint that should return a list of items will
 * return a paginated object with:
 * 1. The total number of resources available,
 * 2. The URL for the next page in the list,
 * 3. The URL for the previous page in the list,
 * 4. A list of names API resources
 */
export interface APIListResponse<Data> {
  count: number
  next: string | null
  previous: string | null
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
  endpoint: string
  identifiers?: Record<string, string | number>
  parameters?: Record<string, string>
}

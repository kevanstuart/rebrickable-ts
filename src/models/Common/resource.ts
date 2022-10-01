/**
 * Calling any API endpoint that should return a list of items will return a paginated object with
 * the total count, a next url, a previous url and the results.
 */
export interface APIResourceList<T> {
  /** The total number of resources available from this API */
  count: number;
  /** The URL for the next page in the list */
  next: string | null;
  /** The URL for the previous page in the list */
  previous: string | null;
  /** A list of named API resources */
  results: T[];
}

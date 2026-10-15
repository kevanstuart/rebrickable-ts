import type { APIResourceList } from '../models';
import { extractDetail, RebrickableError } from './errors';
import { appendQuery, type QueryParams } from './url';

export const DEFAULT_BASE_URL = 'https://rebrickable.com/api/v3';

/** Largest `page_size` Rebrickable accepts */
export const MAX_PAGE_SIZE = 1000;

export interface ClientOptions {
  /** Your Rebrickable API key, from https://rebrickable.com/users/:username/settings/#api */
  apiKey: string;
  /** Override the API base URL */
  baseUrl?: string;
  /** Custom `fetch` implementation, e.g. to add caching or for testing */
  fetch?: typeof fetch;
  /**
   * Minimum delay in milliseconds between requests made by this client.
   * Rebrickable allows an average of one request per second.
   * @defaultValue 1000
   */
  minRequestInterval?: number;
  /**
   * How many times to retry a request after a 429 (throttled) response.
   * @defaultValue 3
   */
  maxRetries?: number;
}

/** Per-call options accepted by every resource method */
export interface CallOptions {
  /** Cancels the request, including any wait for the rate limiter */
  signal?: AbortSignal;
}

export interface RequestOptions extends CallOptions {
  query?: QueryParams;
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });

/**
 * Single HTTP client shared by every resource. Owns authentication,
 * URL building, error mapping and rate limiting, so that all requests
 * from one `Rebrickable` instance share the same request budget.
 */
export class HttpClient {
  readonly #apiKey: string;
  readonly #baseUrl: URL;
  readonly #fetch: typeof fetch;
  readonly #minRequestInterval: number;
  readonly #maxRetries: number;
  #nextRequestAt = 0;

  constructor(options: ClientOptions) {
    if (!options.apiKey) throw new TypeError('A Rebrickable API key is required');

    this.#apiKey = options.apiKey;
    this.#baseUrl = new URL(`${(options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '')}/`);
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.#minRequestInterval = options.minRequestInterval ?? 1000;
    this.#maxRetries = options.maxRetries ?? 3;
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request<T>('GET', this.#resolve(path, options.query), options.signal);
  }

  /**
   * Yields every item of a paginated list endpoint, following `next` links.
   * Any `page` in the query is ignored, and `page_size` defaults to the
   * maximum because it only changes how many requests are made.
   */
  async *paginate<T>(
    path: string,
    options: RequestOptions = {},
  ): AsyncGenerator<T, void, undefined> {
    const { page: _page, ...query }: Record<string, unknown> = { ...options.query };
    query.page_size ??= MAX_PAGE_SIZE;

    let url: URL | undefined = this.#resolve(path, query);

    while (url) {
      const page: APIResourceList<T> = await this.#request('GET', url, options.signal);
      yield* page.results;
      url = page.next ? this.#resolveNext(page.next) : undefined;
    }
  }

  #resolve(path: string, query: QueryParams = {}): URL {
    assertPageSize(query);
    return appendQuery(new URL(path.replace(/^\/+/, ''), this.#baseUrl), query);
  }

  /** Pagination links are absolute; refuse to send the API key anywhere else. */
  #resolveNext(next: string): URL {
    const url = new URL(next);
    if (url.origin !== this.#baseUrl.origin || !url.pathname.startsWith(this.#baseUrl.pathname)) {
      throw new Error(`Refusing to follow pagination link outside the API base URL: ${next}`);
    }
    return url;
  }

  async #request<T>(method: string, url: URL, signal?: AbortSignal): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      await this.#throttle(signal);

      const response = await this.#fetch(url, {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: `key ${this.#apiKey}`,
        },
        signal: signal ?? null,
      });

      const body = await parseBody(response);

      if (response.ok) return body as T;

      if (response.status === 429 && attempt < this.#maxRetries) {
        const delay = retryDelay(response, body) ?? this.#minRequestInterval * 2 ** attempt;
        this.#nextRequestAt = Math.max(this.#nextRequestAt, Date.now() + delay);
        continue;
      }

      throw new RebrickableError(response.status, url.toString(), body);
    }
  }

  /** Reserves the next request slot synchronously, then waits for it. */
  async #throttle(signal?: AbortSignal): Promise<void> {
    const now = Date.now();
    const startAt = Math.max(now, this.#nextRequestAt);
    this.#nextRequestAt = startAt + this.#minRequestInterval;
    if (startAt > now) await sleep(startAt - now, signal);
  }
}

/** Fail locally rather than sending a request Rebrickable will reject */
const assertPageSize = (query: QueryParams): void => {
  if (!('page_size' in query) || query.page_size === undefined) return;

  const size = query.page_size;
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1 || size > MAX_PAGE_SIZE) {
    throw new RangeError(
      `page_size must be a whole number from 1 to ${MAX_PAGE_SIZE}, got ${String(size)}`,
    );
  }
};

const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Rebrickable throttling responses look like
 * `{ "detail": "Request was throttled. Expected available in 2 seconds." }`
 * and may also carry a standard `Retry-After` header.
 */
const retryDelay = (response: Response, body: unknown): number | undefined => {
  const header = Number(response.headers.get('retry-after'));
  if (header > 0) return header * 1000;

  const match = extractDetail(body)?.match(/available in (\d+(?:\.\d+)?) seconds?/i);
  return match?.[1] ? Number(match[1]) * 1000 : undefined;
};

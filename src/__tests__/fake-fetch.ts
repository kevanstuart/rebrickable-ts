import { vi } from 'vitest';

export interface FakeResponse {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * A `fetch` stand-in that replies with queued responses in order
 * and records each request it receives.
 */
export const createFakeFetch = (...responses: FakeResponse[]) => {
  const queue = [...responses];

  const fetch = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) => {
    const next = queue.shift();
    if (!next) throw new Error('Fake fetch received an unexpected request');

    const body = typeof next.body === 'string' ? next.body : JSON.stringify(next.body ?? {});
    return new Response(body, { status: next.status ?? 200, headers: next.headers ?? {} });
  });

  const urls = () => fetch.mock.calls.map(([input]) => String(input));
  const headers = (call = 0) => new Headers(fetch.mock.calls[call]?.[1]?.headers);

  return { fetch, urls, headers };
};

export const page = <T>(results: T[], next: string | null = null) => ({
  count: results.length,
  next,
  previous: null,
  results,
});

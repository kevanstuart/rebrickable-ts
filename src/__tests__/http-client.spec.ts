import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http/client';
import { RebrickableError } from '../http/errors';
import { createFakeFetch, page } from './fake-fetch';

const BASE = 'https://rebrickable.com/api/v3';

const client = (fetch: typeof globalThis.fetch, overrides = {}) =>
  new HttpClient({ apiKey: 'test-key', fetch, minRequestInterval: 0, ...overrides });

describe('HttpClient', () => {
  it('requires an API key', () => {
    expect(() => new HttpClient({ apiKey: '' })).toThrow(/API key/);
  });

  it('authenticates and builds the request URL', async () => {
    const fake = createFakeFetch({ body: { ok: true } });

    const data = await client(fake.fetch).get('/lego/sets/', {
      query: { page_size: 1, search: undefined },
    });

    expect(data).toEqual({ ok: true });
    expect(fake.urls()).toEqual([`${BASE}/lego/sets/?page_size=1`]);
    expect(fake.headers().get('authorization')).toBe('key test-key');
    expect(fake.headers().get('accept')).toBe('application/json');
  });

  it('keeps the path of a custom base URL', async () => {
    const fake = createFakeFetch({ body: {} });

    await client(fake.fetch, { baseUrl: 'http://localhost:8080/proxy/v3/' }).get('/lego/sets/');

    expect(fake.urls()).toEqual(['http://localhost:8080/proxy/v3/lego/sets/']);
  });

  it('throws a RebrickableError with the response detail', async () => {
    const fake = createFakeFetch({ status: 404, body: { detail: 'Not found.' } });

    const error = await client(fake.fetch)
      .get('/lego/sets/111-111/')
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(RebrickableError);
    expect(error).toMatchObject({
      status: 404,
      detail: 'Not found.',
      url: `${BASE}/lego/sets/111-111/`,
    });
  });

  it('keeps non-JSON error bodies as text', async () => {
    const fake = createFakeFetch({ status: 502, body: '<html>Bad Gateway</html>' });

    await expect(client(fake.fetch).get('/lego/sets/')).rejects.toMatchObject({
      status: 502,
      body: '<html>Bad Gateway</html>',
      detail: undefined,
    });
  });

  describe('rate limiting', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('spaces requests by the minimum interval', async () => {
      const fake = createFakeFetch({ body: 1 }, { body: 2 }, { body: 3 });
      const http = client(fake.fetch, { minRequestInterval: 1000 });

      const results = Promise.all([http.get('/a/'), http.get('/b/'), http.get('/c/')]);

      await vi.advanceTimersByTimeAsync(0);
      expect(fake.fetch).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1000);
      expect(fake.fetch).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(1000);
      expect(fake.fetch).toHaveBeenCalledTimes(3);
      await expect(results).resolves.toEqual([1, 2, 3]);
    });

    it('retries throttled requests after the delay Rebrickable asks for', async () => {
      const fake = createFakeFetch(
        {
          status: 429,
          body: { detail: 'Request was throttled. Expected available in 2 seconds.' },
        },
        { body: { ok: true } },
      );

      const result = client(fake.fetch).get('/lego/sets/');

      await vi.advanceTimersByTimeAsync(1999);
      expect(fake.fetch).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
      expect(fake.fetch).toHaveBeenCalledTimes(2);
    });

    it('prefers the Retry-After header', async () => {
      const fake = createFakeFetch(
        { status: 429, headers: { 'retry-after': '5' }, body: {} },
        { body: { ok: true } },
      );

      const result = client(fake.fetch).get('/lego/sets/');

      await vi.advanceTimersByTimeAsync(4999);
      expect(fake.fetch).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
    });

    it('gives up after maxRetries', async () => {
      const throttled = { status: 429, headers: { 'retry-after': '1' }, body: {} };
      const fake = createFakeFetch(throttled, throttled, throttled);

      const result = client(fake.fetch, { maxRetries: 2 })
        .get('/lego/sets/')
        .catch((e: unknown) => e);

      await vi.advanceTimersByTimeAsync(2000);
      expect(await result).toMatchObject({ status: 429 });
      expect(fake.fetch).toHaveBeenCalledTimes(3);
    });

    it('stops waiting when the request is aborted', async () => {
      const fake = createFakeFetch({ body: 1 }, { body: 2 });
      const http = client(fake.fetch, { minRequestInterval: 1000 });
      const controller = new AbortController();

      await http.get('/a/');
      const second = http.get('/b/', { signal: controller.signal }).catch((e: unknown) => e);
      controller.abort(new Error('cancelled'));

      expect(await second).toEqual(new Error('cancelled'));
      expect(fake.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('paginate', () => {
    it('follows next links until the last page', async () => {
      const fake = createFakeFetch(
        { body: page([1, 2], `${BASE}/lego/sets/?page=2&page_size=2`) },
        { body: page([3]) },
      );

      const items: number[] = [];
      for await (const item of client(fake.fetch).paginate<number>('/lego/sets/', {
        query: { page_size: 2 },
      })) {
        items.push(item);
      }

      expect(items).toEqual([1, 2, 3]);
      expect(fake.urls()).toEqual([
        `${BASE}/lego/sets/?page_size=2`,
        `${BASE}/lego/sets/?page=2&page_size=2`,
      ]);
    });

    it('refuses to send the API key to another host', async () => {
      const fake = createFakeFetch({
        body: page([1], 'https://evil.example.com/lego/sets/?page=2'),
      });

      const iterator = client(fake.fetch).paginate<number>('/lego/sets/');

      await expect(iterator.next()).resolves.toEqual({ value: 1, done: false });
      await expect(iterator.next()).rejects.toThrow(/outside the API base URL/);
      expect(fake.fetch).toHaveBeenCalledTimes(1);
    });

    it('defaults page_size to the maximum and ignores page', async () => {
      const fake = createFakeFetch({ body: page([1]) });

      const iterator = client(fake.fetch).paginate<number>('/lego/sets/', {
        query: { page: 3, search: 'x-wing' },
      });
      await iterator.next();

      expect(fake.urls()).toEqual([`${BASE}/lego/sets/?search=x-wing&page_size=1000`]);
    });

    it('keeps an explicit page_size', async () => {
      const fake = createFakeFetch({ body: page([1]) });

      await client(fake.fetch)
        .paginate<number>('/lego/sets/', { query: { page_size: 50 } })
        .next();

      expect(fake.urls()).toEqual([`${BASE}/lego/sets/?page_size=50`]);
    });
  });

  describe('page_size validation', () => {
    it.each([0, 1001, 2.5, '100'])('rejects page_size %j without a request', async (size) => {
      const fake = createFakeFetch();
      const http = client(fake.fetch);

      await expect(http.get('/lego/sets/', { query: { page_size: size } })).rejects.toThrow(
        RangeError,
      );
      await expect(
        http.paginate('/lego/sets/', { query: { page_size: size } }).next(),
      ).rejects.toThrow(/page_size must be a whole number from 1 to 1000/);
      expect(fake.fetch).not.toHaveBeenCalled();
    });

    it('accepts the boundaries and leaves page_size unset for single pages', async () => {
      const fake = createFakeFetch({ body: {} }, { body: {} }, { body: {} });
      const http = client(fake.fetch);

      await http.get('/lego/sets/', { query: { page_size: 1 } });
      await http.get('/lego/sets/', { query: { page_size: 1000 } });
      await http.get('/lego/sets/');

      expect(fake.urls()).toEqual([
        `${BASE}/lego/sets/?page_size=1`,
        `${BASE}/lego/sets/?page_size=1000`,
        `${BASE}/lego/sets/`,
      ]);
    });
  });

  describe('numeric ID validation', () => {
    it.each([
      ['theme_id', '158,171', '"158,171"'],
      ['in_theme_id', 'abc', '"abc"'],
      ['part_cat_id', 1.5, '1.5'],
      ['color_id', Number.NaN, 'NaN'],
    ])('rejects %s = %s without a request', async (param, value, shown) => {
      const fake = createFakeFetch();
      const http = client(fake.fetch);
      const query = { [param]: value };

      await expect(http.get('/lego/sets/', { query })).rejects.toThrow(
        new TypeError(`${param} must be a whole number, got ${shown}`),
      );
      await expect(http.paginate('/lego/sets/', { query }).next()).rejects.toThrow(TypeError);
      expect(fake.fetch).not.toHaveBeenCalled();
    });

    it('accepts whole numbers, including 0 and negative IDs', async () => {
      const fake = createFakeFetch({ body: {} }, { body: {} }, { body: {} });
      const http = client(fake.fetch);

      await http.get('/lego/parts/', { query: { color_id: 0 } });
      await http.get('/lego/parts/', { query: { color_id: -1 } });
      await http.get('/lego/sets/', { query: { theme_id: 158 } });

      expect(fake.urls()).toEqual([
        `${BASE}/lego/parts/?color_id=0`,
        `${BASE}/lego/parts/?color_id=-1`,
        `${BASE}/lego/sets/?theme_id=158`,
      ]);
    });
  });
});

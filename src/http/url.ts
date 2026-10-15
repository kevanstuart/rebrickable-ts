/**
 * Query parameters as a plain object. Values are typed by each resource's
 * input interface; `undefined` values are skipped.
 */
export type QueryParams = object;
export type PathParams = Readonly<Record<string, string | number>>;

/**
 * Fills `:name` placeholders in an endpoint template with URL-encoded values.
 * Throws if a placeholder has no value, so a missing identifier never silently
 * turns a detail request into a list request.
 */
export const buildPath = (template: string, params: PathParams = {}): string =>
  template.replace(/:(\w+)/g, (_, name: string) => {
    const value = params[name];

    if (value === undefined || value === '') {
      throw new TypeError(`Missing value for path parameter "${name}" in ${template}`);
    }

    return encodeURIComponent(String(value));
  });

/**
 * Appends query parameters to a URL, skipping `undefined` values.
 * Booleans are flags in the Rebrickable API: `true` is sent as `1`
 * and `false` is left out.
 */
export const appendQuery = (url: URL, query: QueryParams = {}): URL => {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === false) continue;

    if (value === true) {
      url.searchParams.set(key, '1');
      continue;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(`Unsupported value for query parameter "${key}"`);
    }

    url.searchParams.set(key, String(value));
  }

  return url;
};

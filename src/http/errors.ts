/**
 * Thrown when the Rebrickable API responds with a non-2xx status.
 */
export class RebrickableError extends Error {
  override readonly name = 'RebrickableError';

  constructor(
    /** HTTP status code of the response */
    readonly status: number,
    /** Request URL, with no credentials attached */
    readonly url: string,
    /** Parsed JSON body if the response had one, otherwise the raw text */
    readonly body: unknown,
  ) {
    super(`Rebrickable API request failed with ${status}: ${describe(body)} (${url})`);
  }

  /** The `detail` message Rebrickable includes in most error bodies */
  get detail(): string | undefined {
    return extractDetail(this.body);
  }
}

export const extractDetail = (body: unknown): string | undefined =>
  typeof body === 'object' && body !== null && 'detail' in body && typeof body.detail === 'string'
    ? body.detail
    : undefined;

const describe = (body: unknown): string => {
  const detail = extractDetail(body);
  if (detail) return detail;
  if (typeof body === 'string' && body.length > 0) return body.slice(0, 200);
  return 'no error detail provided';
};

/**
 * Returns a valid string from the URLSearchParams global API
 * where params is a key value object
 */
export function getQueryStringFromParams (
  params: Record<string, string>
): undefined | string {
  try {
    const querystring = new URLSearchParams(params).toString()
    return querystring !== ''
      ? '?' + querystring
      : undefined
  } catch (e: unknown) {
    console.log((e as Error).message)
    return undefined
  }
}

export function getUrlWithIdentifiers (
  endpoint: string,
  parameters: Record<string, string | number>
): string {
  if (parameters.constructor !== Object) return endpoint

  const keys = Object.keys(parameters)
  if (keys.length === 0) return endpoint

  return keys.reduce((url, item) => {
    const value = parameters[item] as string
    return url.replace(`:${item}`, value)
  }, endpoint)
}

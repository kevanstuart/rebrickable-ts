export interface Indentifier {
  key: string;
  value: number | string;
}

export interface BuildQueryInput {
  endpoint: string;
  params?: Record<string, number | string>;
  identifier?: Indentifier;
}

export const formatParamsToQueryString = (
  params: Record<string, number | string>
): string | undefined => {
  if (params.constructor !== Object) return undefined;

  const keys = Object.keys(params);
  if (keys.length === 0) return undefined;

  const arr = [];

  for (const param of keys) {
    arr.push(`${param}=${params[param]}`);
  }

  return `?${arr.join('&')}`;
};

export const buildQueryUrl = (input: BuildQueryInput): string | undefined => {
  if (!input.endpoint) return undefined;

  const queryString = input.params && formatParamsToQueryString(input.params);
  const url = !!queryString ? `${input.endpoint}${queryString}` : `${input.endpoint}`;

  return input.identifier
    ? url.replace(`:${input.identifier.key}`, input.identifier.value.toString())
    : url;
};

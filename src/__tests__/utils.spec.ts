import { Endpoints } from '../types/endpoints';
import {
  formatParamsToQueryString,
  FormatParamsInput,
  buildQueryUrl,
} from '../utils/query-builder';

describe('Object To Query String Test Suite', () => {
  const queryStringInput: FormatParamsInput = {
    page: 2,
    page_size: 1,
    search: 'AT-AT',
    min_year: 2002,
  };

  const queryStringOutput = '?page=2&page_size=1&search=AT-AT&min_year=2002';

  it('should return undefined with no input', () => {
    const queryString = formatParamsToQueryString({});
    expect(queryString).toBeUndefined();
  });

  it('should return undefined with invalid input', () => {
    // @ts-expect-error test passing invalid string argument
    const queryString = formatParamsToQueryString([1, 2, 3]);
    expect(queryString).toBeUndefined();
  });

  it('should return a valid query string with a valid input', () => {
    const queryString = formatParamsToQueryString(queryStringInput);
    expect(queryString).toEqual(queryStringOutput);
  });
});

describe('Build Query URL Test Suite', () => {
  const inputNoParams = { endpoint: Endpoints.Sets };
  const inputNoSetNum = {
    endpoint: Endpoints.Sets,
    params: { page_size: 1 },
  };
  const inputFull = {
    endpoint: Endpoints.MinifigParts,
    params: { page_size: 1 },
    identifier: { key: 'set_num', value: '111-111' },
  };

  it('should return undefined if no endpoint is specified', () => {
    // @ts-expect-error test passing invalid string argument
    const url = buildQueryUrl({});
    expect(url).toBeUndefined();
  });

  it('should return a valid URL with no parameters, or identifier', () => {
    const url = buildQueryUrl(inputNoParams);
    expect(url).toBe('/lego/sets');
  });

  it('should return a valid URL with parameters, but no identifier', () => {
    const url = buildQueryUrl(inputNoSetNum);
    expect(url).toBe('/lego/sets?page_size=1');
  });

  it('should return a valid URL with parameters and identifier', () => {
    const url = buildQueryUrl(inputFull);
    expect(url).toBe('/lego/minifigs/111-111/parts?page_size=1');
  });
});

import objectToQueryString, { ObjectToQueryString } from '../utils/querystring';

describe('Object To Query String Test Suite', () => {
  const validInputWithParams: ObjectToQueryString = {
    page_size: 1,
    page: 2,
    search: 'AT-AT',
    min_year: 2002,
  };

  const validOutputWithParams = '?page_size=1&page=2&search=AT-AT&min_year=2002';

  it('should return a valid query string with a valid input', () => {
    const result = objectToQueryString(validInputWithParams);
    console.log(result);
    expect(result).toEqual(validOutputWithParams);
  });

  it('should return undefined with no input', () => {
    const result = objectToQueryString({});
    expect(result).toBeUndefined();
  });

  it('should return undefined with invalid input', () => {
    const result = objectToQueryString([1, 2, 3]);
    expect(result).toBeUndefined();
  });
});

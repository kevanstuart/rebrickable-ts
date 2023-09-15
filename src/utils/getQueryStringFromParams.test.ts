import { getQueryStringFromParams } from './getQuerystringFromParams'
import { SetsRequestParameters } from '../models/set'
import { describe, it, expect } from 'vitest'

const params: SetsRequestParameters = {
  page: 1,
  min_year: 2002,
  max_year: 2003,
  ordering: 'name',
  page_size: 10
}

describe('Get query string from Params - Query Builder Tests', () => {
  it('should return undefined for invalid input', () => {
    // @ts-expect-error - in favour of a failing test
    const result = getQueryStringFromParams(['1', '2', '3', '4'])
    expect(result).toBeUndefined()
  })

  it('should return undefined for empty input', () => {
    const result = getQueryStringFromParams({})
    expect(result).toBeUndefined()
  })

  it('Params to be correctly parsed into a query string', () => {
    const expectedResult = '?page=1&min_year=2002&max_year=2003&ordering=name&page_size=10'
    const queryString = getQueryStringFromParams(params as Record<string, string>)
    expect(queryString).toEqual(expectedResult)
  })
})

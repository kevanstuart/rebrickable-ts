import { afterEach, describe, it, expect, vi } from 'vitest'
import { getApiQueryFromParams } from './getApiQueryUrlFromParams'

describe('Build Query - Query Builder Tests', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return undefined for invalid input', () => {
    // @ts-expect-error test passing invalid string argument
    const result = getApiQueryFromParams()
    expect(result).toBeUndefined()
  })

  it('should return undefined for a missing endpoint parameter', () => {
    // @ts-expect-error test passing invalid object
    const result = getApiQueryFromParams({ parameters: { min_year: 2002 } })
    expect(result).toBeUndefined()
  })

  it('should return a valid url without parameters', () => {
    const expectedResult = 'https://rebrickable.com/api/v3/lego/sets'
    const result = getApiQueryFromParams({ endpoint: '/lego/sets' })
    expect(result).toEqual(expectedResult)
  })

  it('should return a valid url with some parameters', () => {
    vi.doMock('./getQuerystringFromParams', () => {
      return {
        getQuerystringFromParams: vi.fn(() => '?min_year=2002&max_year=2003')
      }
    })

    const expected = 'https://rebrickable.com/api/v3/lego/sets/?min_year=2002&max_year=2003'
    const result = getApiQueryFromParams({
      endpoint: '/lego/sets',
      parameters: { min_year: '2002', max_year: '2003' }
    })

    expect(result).toEqual(expected)
  })

  it('should return a valid url with an identifier', () => {
    vi.doMock('./getUrlWithIdentifiers', () => {
      return {
        getUrlWithIdentifiers: vi.fn(() => '/api/v3/lego/sets/123456')
      }
    })

    const expected = 'https://rebrickable.com/api/v3/lego/sets/123456'
    const result = getApiQueryFromParams({
      endpoint: '/lego/sets/:set_num',
      identifiers: { set_num: 123456 }
    })

    expect(result).toEqual(expected)
  })

  it('should return a valid url with both identifiers and params', () => {
    vi.doMock('./getQuerystringFromParams', () => {
      return {
        getQuerystringFromParams: vi.fn(() => '?page_size=15')
      }
    })

    vi.doMock('./getUrlWithIdentifiers', () => {
      return {
        getUrlWithIdentifiers: vi.fn(() => '/api/v3/lego/sets/123456/parts/?page_size=15')
      }
    })

    const expected = 'https://rebrickable.com/api/v3/lego/sets/123456/parts/?page_size=15'
    const result = getApiQueryFromParams({
      endpoint: '/lego/sets/:set_num/parts',
      identifiers: { set_num: 123456 },
      parameters: { page_size: '15' }
    })

    expect(result).toEqual(expected)
  })
})

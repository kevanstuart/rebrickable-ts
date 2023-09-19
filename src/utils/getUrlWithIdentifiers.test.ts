import { getUrlWithIdentifiers } from './getUrlWithIdentifiers'
import { describe, it, expect } from 'vitest'

const multipleParamReturn = '/lego/parts/123456/colors/123456'
const multipleParamUrl = '/lego/parts/:part_num/colors/:color_id'
const multipleParams = {
  part_num: 123456,
  color_id: 123456
}

const singleParamReturn = '/lego/sets/123456'
const singleParamUrl = '/lego/sets/:set_num'
const singleParams: Record<string, string | number> = {
  set_num: 123456
}

describe('Get URL with Identifiers - Query Builder Tests', () => {
  it('should return the original url for invalid input', () => {
    // @ts-expect-error
    const result = getUrlWithIdentifiers(singleParamUrl, [1])
    expect(result).toBe(singleParamUrl)
  })

  it('should return the original url for empty input', () => {
    const result = getUrlWithIdentifiers(singleParamUrl, {})
    expect(result).toBe(singleParamUrl)
  })

  it('Params to be correctly parsed into a query string', () => {
    const returnedUrl = getUrlWithIdentifiers(singleParamUrl, singleParams)
    expect(returnedUrl).toEqual(singleParamReturn)
  })

  it('Multiple params to be correctly parsed into a query string', () => {
    const returnedUrl = getUrlWithIdentifiers(multipleParamUrl, multipleParams)
    expect(returnedUrl).toEqual(multipleParamReturn)
  })
})

import { getQueryStringFromParams } from './getQuerystringFromParams'
import { getUrlWithIdentifiers } from './getUrlWithIdentifiers'
import type { ApiUrlOptions } from '../models/base'
import { baseUrl } from '../endpoints'

/**
 * The Build Query function will return a Rebrickable URL based on the ApiUrlOptions
 * 1. An endpoint
 * 2. One or more optional identifiers for specifiying a set, part or minifigure
 * 3. One or more optional query parameters for filtering and sorting
 */
export function getApiQueryFromParams (
  apiUrlOptions: ApiUrlOptions
): undefined | string {
  if (apiUrlOptions === undefined) return

  if (apiUrlOptions.endpoint === undefined) return
  let url = apiUrlOptions.endpoint

  if (apiUrlOptions.parameters !== undefined) {
    const querystring = getQueryStringFromParams(apiUrlOptions.parameters)
    url += querystring !== undefined ? `/${querystring}` : ''
  }

  if (apiUrlOptions.identifiers !== undefined) {
    url = getUrlWithIdentifiers(url, apiUrlOptions.identifiers) ?? url
  }

  return baseUrl + url
}

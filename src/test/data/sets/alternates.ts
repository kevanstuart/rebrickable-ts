import type { APIListResponse } from '../../../models/base'
import type { SetAlternate } from '../../../models/set'
import { alternates } from './data'

export const setAlternates: APIListResponse<SetAlternate> = {
  count: 17,
  next: null,
  previous: null,
  results: alternates
}

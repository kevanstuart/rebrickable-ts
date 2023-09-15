import type { APIListResponse } from '../../../models/base'
import type { Set } from '../../../models/set'
import { sets } from './data'

export const listSets: APIListResponse<Set> = {
  count: 162,
  next: 'https://rebrickable.com/api/v3/lego/sets/?min_year=2020&page=2&page_size=5&theme_id=158',
  previous: null,
  results: sets
}

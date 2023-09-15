import type { APIListResponse } from '../../../models/base'
import type { SetMinifig } from '../../../models/set'
import { minifigs } from './data'

export const setMinifigs: APIListResponse<SetMinifig> = {
  count: 1,
  next: null,
  previous: null,
  results: minifigs
}

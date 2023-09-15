import type { APIListResponse } from '../../../models/base'
import type { Part } from '../../../models/part'
import { parts } from './data'

export const setParts: APIListResponse<Part> = {
  count: 2,
  next: null,
  previous: null,
  results: parts
}

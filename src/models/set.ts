
import type { Color } from './color'
import type { Part } from './part'

/**
 * The base request for most Rebrickable API's includes;
 * 1. A page number within the paginated result set
 * 2. Number of results to return per page
 */
interface BaseListRequest {
  page?: number
  page_size?: number
}

/**
 * Calling the Sets endpoint should optionally pass the following
 * parameters as per the Rebrickable API documentation.
 */
export interface SetsRequest extends BaseListRequest {
  theme_id?: string
  min_year?: number
  max_year?: number
  ordering?: string
  min_parts?: number
  max_parts?: number
}

/**
 * Calling the Set endpoint should pass the set number parameter
 */
export interface SetRequest {
  setNum: string
}

/**
 * Calling the Sets / GetSet endpoint should return this named
 * API resource
 */
export interface Set {
  name: string
  year: number
  set_num: string
  set_url: string
  theme_id: number
  num_parts: number
  set_img_url: string | null
  last_modified_dt: string
}

/**
 * Calling the Set Alternates endpoint should pass the set number
 * and optional ordering, paging parameters
 */
export interface SetAlternatesRequest extends BaseListRequest {
  setNum: string
  ordering?: string
}

/**
 * Calling the Set Alternates endpoint should return an amended named
 * API resource "Set"
 */
export interface SetAlternate extends Omit<Set, 'set_url' | 'set_img_url' | 'last_modified_dt'> {
  moc_img_url: string | null
  designer_name: string
  designer_url: string
  moc_url: string
}

/**
 * Calling the Set Minifigs endpoint should pass the set number
 * and optional paging parameters
 */
export interface SetMinifigsRequest extends BaseListRequest {
  setNum: string
}

/**
 * Calling the Set Minifigs endpoint should return a subset of the
 * named API resource "Set"
 */
export interface SetMinifig extends Pick<Set, 'set_num' | 'set_img_url'> {
  id: number
  quantity: number
  set_name: string
}

/**
  * Calling the Set Parts endpoint should pass the set number
  * and optional paging parameters
 */
export interface SetPartsRequest extends BaseListRequest {
  setNum: string
}

/**
 * Calling the Set Parts endpoint should return this named API resource
 */
export interface SetPart {
  id: number
  inv_part_id: number
  part: Part
  color: Color
  set_num: string
  quantity: number
  is_spare: boolean
  element_id: string
  num_set: number
}

/**
 * Calling the Set Inventory endpoint should pass the set number
 * and optional paging parameters
 */
export interface SetInventoryRequest extends BaseListRequest {
  setNum: string
}

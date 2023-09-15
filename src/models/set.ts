
import type { Color } from './color'
import type { Part } from './part'

/**
 * Details provided by Rebrickable for a Lego set.
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
 * Set List Request Parameters
 */
export interface SetsRequestParameters {
  page?: number
  search?: string
  theme_id?: string
  min_year?: number
  max_year?: number
  ordering?: string
  page_size?: number
  min_parts?: number
  max_parts?: number
}

/**
 * Set Inventory Sets Request Parameters
 */
export interface SetsInventoryRequestParameters {
  page?: number
  page_size?: number
}

/**
 * Set Parts Request Parameters
 */
export interface SetsPartsRequestParameters {
  page?: number
  page_size?: number
}

export interface SetsMinifigsRequestParameters {
  page?: number
  page_size?: number
}

export interface SetsAlternatesRequestParameters {
  page?: number
  page_size?: number
}

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

export interface SetMinifig {
  id: number
  set_num: string
  set_name: string
  quantity: number
  set_img_url: string | null
}

export interface SetAlternate {
  set_num: string
  name: string
  year: number
  theme_id: number
  num_parts: number
  moc_img_url: string | null
  moc_url: string | null
  designer_name: string
  designer_url: string
}

/**
 * A single Set Request Parameters
 */
export interface SetRequestParameters {
  setNum: number | string
}

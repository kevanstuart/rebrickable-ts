import type { Color } from '../Color';
import type { Part } from '../Part';

export interface LegoSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string | null;
  set_url: string;
  /** ISO 8601 timestamp */
  last_modified_dt: string;
}

export interface PaginationParameters {
  page?: number;
  /** Defaults to 100, maximum 1000 */
  page_size?: number;
}

export interface ListSetsInput extends PaginationParameters {
  search?: string;
  theme_id?: number | string;
  min_year?: number;
  max_year?: number;
  min_parts?: number;
  max_parts?: number;
  /** Field to order by; prefix with `-` to reverse */
  ordering?: string;
}

export interface SetAlternates extends LegoSet {
  moc_img_url: string;
  moc_url: string;
  designer_name: string;
  designer_url: string;
}

export interface SetsAlternatesInput extends PaginationParameters {
  ordering?: string;
}

export interface SetParts {
  id: number;
  inv_part_id: number;
  set_num: string;
  part: Part;
  color: Color;
  quantity: number;
  is_spare: boolean;
  element_id: string | null;
  num_sets: number;
}

export interface SetsPartsInput extends PaginationParameters {
  /** Return the full part details for each part */
  inc_part_details?: boolean;
}

export interface SetMinifigs {
  id: number;
  set_num: string;
  set_name: string;
  quantity: number;
  set_img_url: string | null;
}

export type SetsMinifigInput = PaginationParameters;
export type SetsInventoryInput = PaginationParameters;

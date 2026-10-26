import type { Color } from '../Color';
import type { OrderingParameters, PaginationParameters } from '../Common';
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

export interface ListSetsInput extends PaginationParameters, OrderingParameters {
  search?: string;
  theme_id?: number;
  min_year?: number;
  max_year?: number;
  min_parts?: number;
  max_parts?: number;
}

/** A MOC that can be built from the parts of a set */
export interface SetAlternate
  extends Omit<LegoSet, 'set_url' | 'set_img_url' | 'last_modified_dt'> {
  moc_img_url: string | null;
  moc_url: string;
  designer_name: string;
  designer_url: string;
}

export interface SetAlternatesInput extends PaginationParameters, OrderingParameters {}

/**
 * One line of a set's part inventory. `part` is `PartDetails` when the
 * inventory is requested with `inc_part_details`.
 */
export interface SetPart<P extends Part = Part> {
  id: number;
  inv_part_id: number;
  set_num: string;
  part: P;
  color: Color;
  quantity: number;
  is_spare: boolean;
  element_id: string | null;
  num_sets: number;
}

export interface SetPartsInput extends PaginationParameters {
  /** Return the full part details for each part */
  inc_part_details?: boolean;
}

/** A set or minifig contained in another set's inventory */
export interface SetInventoryItem {
  id: number;
  set_num: string;
  set_name: string;
  quantity: number;
  set_img_url: string | null;
}

/** One minifig in a set's inventory */
export type SetMinifig = SetInventoryItem;

export interface SetMinifigsInput extends PaginationParameters {}
export interface SetSubsetsInput extends PaginationParameters {}

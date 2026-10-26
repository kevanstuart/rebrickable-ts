import type { OrderingParameters, PaginationParameters } from '../Common';

/**
 * A part's IDs in other systems, keyed by system name, e.g.
 * `{ BrickLink: ['3005pb053'], LEGO: ['72087'] }`.
 */
export type PartExternalIds = Record<string, string[]>;

/** A part as it appears in lists and inventories */
export interface Part {
  part_num: string;
  name: string;
  part_cat_id: number;
  part_url: string;
  part_img_url: string | null;
  external_ids: PartExternalIds;
}

/**
 * A part with its full details, as returned for a single part, inside an
 * element, or in lists requested with `inc_part_details`.
 */
export interface PartDetails extends Part {
  year_from: number;
  year_to: number;
  /** Part numbers of printed versions of this part */
  prints: string[];
  /** Part numbers of mold variations of this part */
  molds: string[];
  /** Part numbers of alternate parts */
  alternates: string[];
  /** Part number of the unprinted part, if this part is a print */
  print_of: string | null;
}

/** Statistics shared by a part's colors list and a single part/color pair */
export interface PartColorStats {
  /** Number of sets this part appears in, in this color */
  num_sets: number;
  /** Total quantity of this part across those sets */
  num_set_parts: number;
  part_img_url: string | null;
  /** LEGO element IDs for this part in this color */
  elements: string[];
}

/** One color a part has appeared in */
export interface PartColor extends PartColorStats {
  color_id: number;
  color_name: string;
}

/** Details of a single part/color combination */
export interface PartColorDetails extends PartColorStats {
  year_from: number;
  year_to: number;
}

export interface ListPartsInput extends PaginationParameters, OrderingParameters {
  search?: string;
  part_num?: string;
  /** Several part numbers at once; sent comma-separated */
  part_nums?: readonly string[];
  part_cat_id?: number;
  /**
   * Only parts that have appeared in this color. Rebrickable ignores an
   * invalid value and returns every part, so it's checked before sending
   */
  color_id?: number;
  bricklink_id?: string;
  brickowl_id?: string;
  lego_id?: string;
  ldraw_id?: string;
  /** Return the full details for each part */
  inc_part_details?: boolean;
}

export interface PartColorsInput extends PaginationParameters, OrderingParameters {}
export interface PartColorSetsInput extends PaginationParameters, OrderingParameters {}

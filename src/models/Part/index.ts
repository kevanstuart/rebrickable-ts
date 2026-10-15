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

export interface PartColors {
  color_id: number;
  color_name: string;
  num_sets: number;
  num_set_parts: number;
  part_img_url: string;
  year_from?: number;
  year_to?: number;
  elements: string[];
}

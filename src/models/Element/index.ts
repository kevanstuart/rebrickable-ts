import type { Color } from '../Color';
import type { PartDetails } from '../Part';

/**
 * A specific part in a specific color, identified by LEGO's element ID.
 */
export interface Element {
  /** LEGO's element ID, e.g. `4244370` */
  element_id: string;
  /** LEGO's design ID; can differ from `part.part_num`, which is Rebrickable's number */
  design_id: string;
  element_img_url: string | null;
  part_img_url: string | null;
  color: Color;
  part: PartDetails;
}

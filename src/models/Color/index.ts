import type { OrderingParameters, PaginationParameters } from '../Common';

/**
 * A color's IDs in other systems, keyed by system name (e.g. `BrickLink`, `LEGO`).
 */
export type ColorExternalIds = Record<
  string,
  {
    ext_ids: (number | null)[];
    ext_descrs: string[][];
  }
>;

export interface Color {
  /** Rebrickable color ID; `-1` is "[Unknown]" */
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: ColorExternalIds;
}

export interface ListColorsInput extends PaginationParameters, OrderingParameters {}

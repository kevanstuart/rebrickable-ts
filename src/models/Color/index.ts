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
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: ColorExternalIds;
}

import type { OrderingParameters, PaginationParameters } from '../Common';
import type { Part } from '../Part';
import type { LegoSet, SetPart, SetPartsInput } from '../Set';

/**
 * A minifig. Rebrickable stores minifigs as a kind of set, numbered like
 * `fig-010697`, without a year or theme.
 */
export type Minifig = Omit<LegoSet, 'year' | 'theme_id'>;

/** A set a minifig has appeared in; like `LegoSet` but without a year or theme */
export type MinifigSet = Minifig;

/**
 * One line of a minifig's part inventory, where `set_num` is the minifig
 * number. `part` is `PartDetails` when requested with `inc_part_details`.
 */
export type MinifigPart<P extends Part = Part> = SetPart<P>;

export interface ListMinifigsInput extends PaginationParameters, OrderingParameters {
  search?: string;
  min_parts?: number;
  max_parts?: number;
  /** Only minifigs that appear in this set, e.g. `30625-1` */
  in_set_num?: string;
  /**
   * Only minifigs that appear in sets of this theme. Rebrickable ignores an
   * invalid value and returns every minifig, so it's checked before sending
   */
  in_theme_id?: number;
}

export type MinifigPartsInput = SetPartsInput;
export interface MinifigSetsInput extends PaginationParameters, OrderingParameters {}

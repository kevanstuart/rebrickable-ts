import { ApiListParams } from '../Common';

import { Set, SetRequestParameters } from '../Set';

/**
 * Minifigures are also classed as individual sets, so will
 * have a Set number, image URL, etc.
 */
export type Minifig = Omit<Set, 'year' | 'theme_id'>;

export type ListMinifigsInput = Partial<SetRequestParameters>;

/**
 * Input for Minigif parts excludes "Ordering" paramter.
 */
export type MinifigPartsInput = Omit<ApiListParams, 'ordering'>;

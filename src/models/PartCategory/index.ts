import type { OrderingParameters, PaginationParameters } from '../Common';

export interface PartCategory {
  id: number;
  name: string;
  /** Number of parts in this category */
  part_count: number;
}

export interface ListPartCategoriesInput extends PaginationParameters, OrderingParameters {}

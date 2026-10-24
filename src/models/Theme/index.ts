import type { OrderingParameters, PaginationParameters } from '../Common';

export interface Theme {
  id: number;
  /** ID of the parent theme; `null` for top-level themes */
  parent_id: number | null;
  name: string;
}

export interface ListThemesInput extends PaginationParameters, OrderingParameters {}

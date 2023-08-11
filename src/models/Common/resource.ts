/**
 * Calling any API endpoint that returns a list will return the following object
 */
export interface ApiListResults<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * All possible API parameters
 */
export interface ApiBaseInput {
  page: number; // colors | minifigs | minifigs/id/parts | minifigs/id/sets | part_categories | parts
  page_size: number; // colors | minifigs | minifigs/id/parts | minifigs/id/sets | part_categories | parts
  ordering: string; // colors | colors/id | minifigs | part_categories |  | part_categories/id
  min_parts: number; // minifigs
  max_parts: number; // minifigs
  in_set_num: string; // minifigs
  in_theme_id: string; // minifigs
  search: string; // minifigs
  theme_id: string;
  min_year: number;
  max_year: number;
  part_num: string; // parts
  part_nums: string; // parts
}

export interface ApiListParams {
  page?: number;
  page_size?: number;
  ordering?: string;
}

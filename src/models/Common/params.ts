/** Paging parameters accepted by every list endpoint */
export interface PaginationParameters {
  page?: number;
  /** Defaults to 100, maximum 1000 */
  page_size?: number;
}

/** Sorting parameter accepted by most list endpoints */
export interface OrderingParameters {
  /** Field to order by; prefix with `-` to reverse */
  ordering?: string;
}

/** Input for `listAll` methods, which walk every page themselves */
export type AllPagesInput<T extends PaginationParameters> = Omit<T, 'page'>;

/** Input that asks for full part details, used to type the details overloads */
export type WithDetails<T> = T & { inc_part_details: true };

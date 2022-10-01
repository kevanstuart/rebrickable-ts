import { Color } from '../Color';
import { Part } from '../Part';

export interface Set {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: URL;
  set_url: URL;
  last_modified_dt: Date;
}

export interface SetRequestParameters {
  page: number;
  search: string;
  theme_id: string;
  min_year: number;
  max_year: number;
  ordering: string;
  page_size: number;
  min_parts: number;
  max_parts: number;
}

export type ListSetsInput = Partial<SetRequestParameters>;

export interface SetAlternates extends Set {
  moc_img_url: URL;
  moc_url: URL;
  designer_name: string;
  designer_url: URL;
}

export type SetsAlternatesInput = Pick<SetRequestParameters, 'page' | 'ordering' | 'page_size'>;

export interface SetParts {
  id: number;
  inv_part_id: number;
  set_num: string;
  part: Part;
  color: Color;
  quantity: number;
  is_spare: boolean;
  element_id: string;
  num_sets: number;
}

export type SetsPartsInput = Pick<SetRequestParameters, 'page' | 'page_size'>;

export interface SetMinifigs {
  id: number;
  set_num: string;
  set_name: string;
  quantity: number;
  set_img_url: URL;
}

export type SetsMinifigInput = Pick<SetRequestParameters, 'page' | 'page_size'>;
export type SetsInventoryInput = Pick<SetRequestParameters, 'page' | 'page_size'>;

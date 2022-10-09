import { ExternalId } from '../Common/external-id';

export interface Part {
  part_num: string;
  name: string;
  part_cat_id: number;
  year_from?: number;
  year_to?: number;
  part_url: string;
  part_img_url: string | null;
  prints?: string[];
  molds?: string[];
  alternates?: string[];
  external_ids: ExternalId[];
  print_of: string | null;
}

export interface PartColors {
  color_id: number;
  color_name: string;
  num_sets: number;
  num_set_parts: number;
  part_img_url: string;
  year_from?: number;
  year_to?: number;
  elements: string[];
}

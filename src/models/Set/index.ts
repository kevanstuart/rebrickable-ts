import { Url } from "url";

import { Color } from "../Color";
import { Part } from "../Part";

export interface Set {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: Url;
  set_url: Url;
  last_modified_dt: Date;
}

export interface AlternateSet extends Set {
  moc_img_url: Url;
  moc_url: Url;
  designer_name: string;
  designer_url: Url;
}

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

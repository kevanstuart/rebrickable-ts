import { Url } from 'node:url';

import { Color } from '../Color';
import { Part } from '../Part';

export interface Element {
  element_id: string;
  design_id: string;
  element_img_url: Url;
  part_img_url: Url;
  color: Color;
  part: Part;
}

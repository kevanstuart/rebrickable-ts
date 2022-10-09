import { Color } from '../Color';
import { Part } from '../Part';

export interface Element {
  element_id: string;
  design_id: string;
  element_img_url: string;
  part_img_url: string;
  color: Color;
  part: Part;
}

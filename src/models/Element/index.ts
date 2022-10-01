import { Color } from '../Color';
import { Part } from '../Part';

export interface Element {
  element_id: string;
  design_id: string;
  element_img_url: URL;
  part_img_url: URL;
  color: Color;
  part: Part;
}

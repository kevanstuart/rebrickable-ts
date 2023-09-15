export interface ExternalIds {
  [index: string]: string[]
}

export interface Part {
  part_num: string
  name: string
  part_cat_id: number
  part_url: string
  part_img_url: string
  external_ids: ExternalIds
  print_of: unknown
}

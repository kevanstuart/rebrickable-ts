interface ExternalIds {
  [index: string]: {
    ext_ids: number[] | null[]
    ext_descrs: string[][]
  }
}

export interface Color {
  id: number
  name: string
  rgb: string
  is_trans: boolean
  external_ids: ExternalIds
}

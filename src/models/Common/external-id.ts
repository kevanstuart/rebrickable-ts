export interface ExternalId {
  [index: string]: {
    ext_ids: number[];
    ext_descrs: string[];
  };
}

import { ExternalId } from "../Common/external-id";

export interface Color {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: ExternalId[];
}
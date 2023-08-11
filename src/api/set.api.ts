import { AxiosError, AxiosResponse } from 'axios';

import { buildQueryUrl } from '../utils/query-builder';
import { BaseApiClass } from './base.api';
import { ENDPOINTS } from '../types';
import {
  ApiListResults,
  ListSetsInput,
  Set,
  SetAlternates,
  SetMinifigs,
  SetParts,
  SetsAlternatesInput,
  SetsInventoryInput,
  SetsMinifigInput,
  SetsPartsInput,
} from '../models';

/**
 * The Set API class provides functionality to retrieve information
 * about sets and information that may be attached to a set.
 */
export class SetApiClass extends BaseApiClass {
  public async getSets(params: ListSetsInput = {}): Promise<ApiListResults<Set>> {
    const url = buildQueryUrl({
      endpoint: ENDPOINTS.SETS.BASE,
      params: { ...params },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<ApiListResults<Set>>((resolve, reject) => {
      this.api
        .get<ApiListResults<Set>>(url)
        .then((response: AxiosResponse<ApiListResults<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetBySetNum(set_num: string): Promise<Set> {
    const url = `${ENDPOINTS.SETS.BASE}/${set_num}`;

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<Set>((resolve, reject) => {
      this.api
        .get<Set>(url)
        .then((response: AxiosResponse<Set>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetAlternatesBySetNum(
    set_num: string,
    params?: SetsAlternatesInput
  ): Promise<ApiListResults<SetAlternates>> {
    const url = buildQueryUrl({
      endpoint: ENDPOINTS.SETS.ALTERNATES,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<ApiListResults<SetAlternates>>((resolve, reject) => {
      this.api
        .get<ApiListResults<SetAlternates>>(url)
        .then((response: AxiosResponse<ApiListResults<SetAlternates>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetMinifigsBySetNum(
    set_num: string,
    params?: SetsMinifigInput
  ): Promise<ApiListResults<SetMinifigs>> {
    const url = buildQueryUrl({
      endpoint: ENDPOINTS.SETS.MINIFIGS,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<ApiListResults<SetMinifigs>>((resolve, reject) => {
      this.api
        .get<ApiListResults<SetMinifigs>>(url)
        .then((response: AxiosResponse<ApiListResults<SetMinifigs>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetPartsBySetNum(
    set_num: string,
    params?: SetsPartsInput
  ): Promise<ApiListResults<SetParts>> {
    const url = buildQueryUrl({
      endpoint: ENDPOINTS.SETS.PARTS,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<ApiListResults<SetParts>>((resolve, reject) => {
      this.api
        .get<ApiListResults<SetParts>>(url)
        .then((response: AxiosResponse<ApiListResults<SetParts>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Honestly, I don't know what this API endpoint does as Rebrickable are
   * unable to provide an example to test against.
   */
  public async getSubSetsBySetNum(
    set_num: string,
    params?: SetsInventoryInput
  ): Promise<ApiListResults<Set>> {
    const url = buildQueryUrl({
      endpoint: ENDPOINTS.SETS.SETS,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<ApiListResults<Set>>((resolve, reject) => {
      this.api
        .get<ApiListResults<Set>>(url)
        .then((response: AxiosResponse<ApiListResults<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}

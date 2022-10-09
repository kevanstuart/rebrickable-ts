import { AxiosError, AxiosResponse } from 'axios';

import { buildQueryUrl } from '../utils/query-builder';
import { BaseApiClass } from './base.api';
import { Endpoints } from '../types';
import {
  APIResourceList,
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
  public async getSets(params: ListSetsInput = {}): Promise<APIResourceList<Set>> {
    const url = buildQueryUrl({
      endpoint: Endpoints.Sets,
      params: { ...params },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<APIResourceList<Set>>((resolve, reject) => {
      this.api
        .get<APIResourceList<Set>>(url)
        .then((response: AxiosResponse<APIResourceList<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetBySetNum(set_num: string): Promise<Set> {
    const url = `${Endpoints.Sets}/${set_num}`;

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
  ): Promise<APIResourceList<SetAlternates>> {
    const url = buildQueryUrl({
      endpoint: Endpoints.SetsAlternates,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<APIResourceList<SetAlternates>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetAlternates>>(url)
        .then((response: AxiosResponse<APIResourceList<SetAlternates>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetMinifigsBySetNum(
    set_num: string,
    params?: SetsMinifigInput
  ): Promise<APIResourceList<SetMinifigs>> {
    const url = buildQueryUrl({
      endpoint: Endpoints.SetsMinifigs,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<APIResourceList<SetMinifigs>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetMinifigs>>(url)
        .then((response: AxiosResponse<APIResourceList<SetMinifigs>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetPartsBySetNum(
    set_num: string,
    params?: SetsPartsInput
  ): Promise<APIResourceList<SetParts>> {
    const url = buildQueryUrl({
      endpoint: Endpoints.SetsParts,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<APIResourceList<SetParts>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetParts>>(url)
        .then((response: AxiosResponse<APIResourceList<SetParts>>) => resolve(response.data))
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
  ): Promise<APIResourceList<Set>> {
    const url = buildQueryUrl({
      endpoint: Endpoints.SetsSets,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    });

    if (!url) throw new Error('Invalid URL parameters');

    return new Promise<APIResourceList<Set>>((resolve, reject) => {
      this.api
        .get<APIResourceList<Set>>(url)
        .then((response: AxiosResponse<APIResourceList<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}

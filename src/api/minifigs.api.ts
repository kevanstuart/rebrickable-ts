import { AxiosError, AxiosResponse } from 'axios';

import { ApiListResults, ListMinifigsInput, Minifig, MinifigPartsInput } from '../models';
import { buildQueryUrl, BuildQueryInput } from '../utils/query-builder';
import { BaseApiClass } from './base.api';
import { ENDPOINTS } from '../types';

/**
 * The Minifig API class provides functionality to retrieve information
 * about minifigs and related data.
 */
export class MinifigApiClass extends BaseApiClass {
  /**
   * List of minifigures
   * @param params - search term, min and max part sizes, ordering, etc.
   * @returns A list of minifigures
   */
  public async listMinifigs(params: ListMinifigsInput): Promise<ApiListResults<Minifig>> {
    const queryInput: BuildQueryInput = {
      endpoint: ENDPOINTS.MINIFIGS.BASE,
      params: { ...params },
    };

    const url = buildQueryUrl(queryInput) || '';

    return new Promise<ApiListResults<Minifig>>((resolve, reject) => {
      this.api
        .get<ApiListResults<Minifig>>(url)
        .then((response: AxiosResponse<ApiListResults<Minifig>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * A list of minifigures in a specific Set
   * @param set_num - The id of the Lego set
   * @returns A list of minifigures in a set
   */
  public listMinifigBySetNum(set_num: string) {
    const queryInput: BuildQueryInput = {
      endpoint: ENDPOINTS.MINIFIGS.BASE,
      params: {},
      identifier: { key: 'set_num', value: set_num },
    };

    const url = buildQueryUrl(queryInput) || '';

    return new Promise<Minifig>((resolve, reject) => {
      this.api
        .get<Minifig>(url)
        .then((response: AxiosResponse<Minifig>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /* public listMinifigsPartsBySetNum(set_num: string, params: MinifigPartsInput) {
    const queryInput: BuildQueryInput = {
      endpoint: ENDPOINTS.MINIFIGS.PARTS,
      params: { ...params },
      identifier: { key: 'set_num', value: set_num },
    };

    const url = buildQueryUrl(queryInput) || '';

    // return new Promise<ApiListResults<>((resolve, reject) => {
  } */
}

/* 
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
): Promise<APIResourceList<SetAlternates>> {
  const url = buildQueryUrl({
    endpoint: ENDPOINTS.SETS.ALTERNATES,
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
    endpoint: ENDPOINTS.SETS.MINIFIGS,
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
    endpoint: ENDPOINTS.SETS.PARTS,
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
} */

/**
 * Honestly, I don't know what this API endpoint does as Rebrickable are
 * unable to provide an example to test against.
 */
// public async getSubSetsBySetNum(
//   set_num: string,
//   params?: SetsInventoryInput
// ): Promise<APIResourceList<Set>> {
//   const url = buildQueryUrl({
//     endpoint: ENDPOINTS.SETS.SETS,
//     params: { ...params },
//     identifier: { key: 'set_num', value: set_num },
//   });
//   if (!url) throw new Error('Invalid URL parameters');

//   return new Promise<APIResourceList<Set>>((resolve, reject) => {
//     this.api
//       .get<APIResourceList<Set>>(url)
//       .then((response: AxiosResponse<APIResourceList<Set>>) => resolve(response.data))
//       .catch((error: AxiosError<string>) => reject(error));
//   });
// }
// }

import { AxiosError, AxiosResponse } from 'axios';

import {
  APIResourceList,
  Set,
  SetAlternates,
  SetMinifigs,
  SetParts,
  ListSetsInput,
  SetsAlternatesInput,
  SetsMinifigInput,
  SetsPartsInput,
  SetsInventoryInput,
} from '../models';
import { BaseApiClass } from './base.api';
import { Endpoints } from '../constants';

import querystring from '../utils/querystring';

/**
 * * Sets API
 * * * GET - sets
 * * * GET - sets/{set_num}
 * * * GET - sets/{set_num}/alternates
 * * * GET - sets/{set_num}/minifigs
 * * * GET - sets/{set_num}/parts
 * * * GET - sets/{set_num}/sets
 */

export class SetApiClass extends BaseApiClass {
  public async getSets(params: ListSetsInput = {}): Promise<APIResourceList<Set>> {
    const queryString = Object.keys(params).length > 0 ? querystring({ ...params }) : '';

    const url = !!queryString ? `${Endpoints.Sets}${queryString}` : `${Endpoints.Sets}`;

    return new Promise<APIResourceList<Set>>((resolve, reject) => {
      this.api
        .get<APIResourceList<Set>>(url)
        .then((response: AxiosResponse<APIResourceList<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetBySetNum(set_num: string): Promise<Set> {
    const url = `${Endpoints.Sets}/${set_num}`;

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
    const queryString = params && Object.keys(params).length > 0 ? querystring({ ...params }) : '';

    const url = !!queryString
      ? `${Endpoints.SetsAlternates}${queryString}`
      : `${Endpoints.SetsAlternates}`;

    console.log(url);

    return new Promise<APIResourceList<SetAlternates>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetAlternates>>(url.replace(':set_num', set_num))
        .then((response: AxiosResponse<APIResourceList<SetAlternates>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetMinifigsBySetNum(
    set_num: string,
    params?: SetsMinifigInput
  ): Promise<APIResourceList<SetMinifigs>> {
    const queryString = params && Object.keys(params).length > 0 ? querystring({ ...params }) : '';

    const url = !!queryString
      ? `${Endpoints.SetsMinifigs}${queryString}`
      : `${Endpoints.SetsMinifigs}`;

    return new Promise<APIResourceList<SetMinifigs>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetMinifigs>>(url.replace(':set_num', set_num))
        .then((response: AxiosResponse<APIResourceList<SetMinifigs>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  public async getSetPartsBySetNum(
    set_num: string,
    params?: SetsPartsInput
  ): Promise<APIResourceList<SetParts>> {
    const queryString = params && Object.keys(params).length > 0 ? querystring({ ...params }) : '';

    const url = !!queryString ? `${Endpoints.SetsParts}${queryString}` : `${Endpoints.SetsParts}`;

    return new Promise<APIResourceList<SetParts>>((resolve, reject) => {
      this.api
        .get<APIResourceList<SetParts>>(url.replace(':set_num', set_num))
        .then((response: AxiosResponse<APIResourceList<SetParts>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Honestly, I don't know what this API endpoint does as Brickset are
   * unable to provide an example to test against.
   */
  public async getSubSetsBySetNum(
    set_num: string,
    params?: SetsInventoryInput
  ): Promise<APIResourceList<Set>> {
    const queryString = params && Object.keys(params).length > 0 ? querystring({ ...params }) : '';

    const url = !!queryString ? `${Endpoints.SetsSets}${queryString}` : `${Endpoints.SetsSets}`;

    return new Promise<APIResourceList<Set>>((resolve, reject) => {
      this.api
        .get<APIResourceList<Set>>(url.replace(':set_num', set_num))
        .then((response: AxiosResponse<APIResourceList<Set>>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}

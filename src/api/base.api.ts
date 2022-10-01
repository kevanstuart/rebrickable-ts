import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import { AxiosInstance, AxiosRequestHeaders } from 'axios';

import { BaseURL, Headers, ApplicationOptions } from '../constants';

export class BaseApiClass {
  /**
   * The axios instance
   * @internal
   */
  public api: AxiosInstance;

  constructor(options: ApplicationOptions) {
    const headers: AxiosRequestHeaders = {
      'Content-Type': Headers.JSON,
      Authorization: Headers.AUTH.replace(':key', options.token),
    };

    const cacheOptions: IAxiosCacheAdapterOptions = {
      maxAge: options?.cacheOptions?.maxAge || 0,
      ...options?.cacheOptions,
    };

    this.api = setup({
      baseURL: options?.baseURL ?? BaseURL.REST,
      headers: headers,
      cache: cacheOptions,
    });
  }
}

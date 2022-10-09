import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';

/**
 * Base url for the Rebrickable API
 */
export enum BaseURL {
  REST = 'https://rebrickable.com/api/v3',
}

/**
 * Base headers for requests to Rebrickable
 */
export enum Headers {
  JSON = 'application/json',
  AUTH = 'key :key',
}

/**
 * Base application options for api classes
 * @see https://github.com/RasCarlito/axios-cache-adapter fro CacheOptions
 */
export interface ApplicationOptions {
  cacheOptions?: IAxiosCacheAdapterOptions;
  baseURL?: string;
  token: string;
}

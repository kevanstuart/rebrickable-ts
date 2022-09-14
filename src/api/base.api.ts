import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import { AxiosInstance } from 'axios';
import pino from 'pino';

import { BaseURL } from '../constants';

export interface Options {
  logOptions?: pino.LoggerOptions;
  cacheOptions?: IAxiosCacheAdapterOptions;
  baseURL?: string;
}

export type PinoOptions = pino.LoggerOptions | pino.DestinationStream;
const createPino = (options?: PinoOptions): pino.Logger => pino(options);

export class BaseApiClass {
  public api: AxiosInstance;

  public logger: pino.Logger;

  constructor(options?: Options) {
    const apiSetup = {
      baseURL: options?.baseURL ?? BaseURL.REST,
      headers: { 'Content-Type': 'application/json' },
      cache: {
        maxAge: options?.cacheOptions?.maxAge || 0,
        ...options?.cacheOptions,
      },
    };
    this.api = setup(apiSetup);

    const pinoSetup = {
      enabled: !(
        options?.logOptions?.enabled === undefined || options?.logOptions.enabled === false
      ),
      ...options?.logOptions,
    };
    this.logger = createPino(pinoSetup);
  }
}

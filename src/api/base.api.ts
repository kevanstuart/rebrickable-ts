import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import { AxiosInstance, AxiosRequestHeaders } from 'axios';
import pino, { Logger, LoggerOptions } from 'pino';

import { BaseURL, Headers, ApplicationOptions } from '../constants';

export class BaseApiClass {
  /**
   * The axios instance
   * @internal
   */
  public api: AxiosInstance;

  /**
   * The pino logger instance
   * @internal
   */
  public logger: Logger;

  constructor(options: ApplicationOptions) {
    this.api = this.setupApi(options);
    this.logger = this.setupLogging(options);
  }

  /**
   * Set up the main API configuration
   *
   * @param options - Application options for the API set up
   * @returns AxiosInstance
   */
  private setupApi(options: ApplicationOptions): AxiosInstance {
    const headers: AxiosRequestHeaders = {
      'Content-Type': Headers.JSON,
      Authorization: Headers.AUTH.replace(':key', options.token),
    };

    const cacheOptions: IAxiosCacheAdapterOptions = {
      maxAge: options?.cacheOptions?.maxAge || 0,
      ...options?.cacheOptions,
    };

    return setup({
      baseURL: options?.baseURL ?? BaseURL.REST,
      headers: headers,
      cache: cacheOptions,
    });
  }

  /**
   * Set up the main Logging configuration
   *
   * @param options - Application options for the logging set up
   * @returns Logger
   */
  private setupLogging(options: ApplicationOptions): Logger {
    const pinoOptions: LoggerOptions = {
      enabled: !!options?.logOptions?.enabled,
      ...options?.logOptions,
    };

    return pino(pinoOptions);
  }
}

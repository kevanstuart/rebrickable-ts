import { ENDPOINTS } from '../endpoints';
import type { CallOptions, HttpClient } from '../http/client';
import { buildPath } from '../http/url';
import type { Element } from '../models';

/**
 * Elements: a specific part in a specific color, as identified by LEGO.
 */
export class ElementsResource {
  readonly #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  /** Get a single element by its LEGO element ID, e.g. `'4244370'` */
  async get(elementId: string, options: CallOptions = {}): Promise<Element> {
    return this.#http.get(buildPath(ENDPOINTS.ELEMENTS.DETAIL, { element_id: elementId }), options);
  }
}

import { getApiQueryFromParams } from '../utils/getApiQueryUrlFromParams'
import type { APIListResponse } from '../models/base'
import { rebrickableUrls } from '../endpoints'
import { BaseApi } from './base'
import type {
  Set,
  SetsRequest,
  SetPartsRequest,
  SetInventoryRequest,
  SetMinifigsRequest,
  SetAlternatesRequest,
  SetAlternate,
  SetMinifig,
  SetPart
} from '../models/set'

export class SetsApi extends BaseApi {
  /**
   * Gets a filterable, sortable list of sets from the Rebrickable API
   */
  public async getSets (params?: SetsRequest): Promise<APIListResponse<Set>> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.sets,
      parameters: params as Record<string, string>
    })

    if (url === undefined) throw new Error('// GET SETS: Invalid URL parameters')

    return await this.fetchApi(url)
  }

  /**
   * Gets a single set from the Rebrickable API providing a set number
   */
  public async getSet (setNum: string): Promise<Set> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.set,
      identifiers: { set_num: setNum }
    })

    if (url === undefined) throw new Error('// GET SET: Invalid URL parameters')

    return await this.fetchApi(url)
  }

  public async getSetInventorySets (
    setNum: string, params?: SetInventoryRequest
  ): Promise<APIListResponse<Set[]>> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.setSets,
      identifiers: { set_num: setNum },
      parameters: params as Record<string, string> | undefined
    })

    if (url === undefined) throw new Error('// GET SET INVENTORY SETS: Invalid URL parameters')

    return await this.fetchApi(url)
  }

  public async getSetParts (
    setNum: string, params?: SetPartsRequest
  ): Promise<APIListResponse<SetPart>> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.setParts,
      identifiers: { set_num: setNum },
      parameters: params as Record<string, string> | undefined
    })

    if (url === undefined) throw new Error('// GET SET PARTS: Invalid URL parameters')

    return await this.fetchApi(url)
  }

  public async getSetMinifigs (
    setNum: string, params?: SetMinifigsRequest
  ): Promise<APIListResponse<SetMinifig>> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.setMinifigs,
      identifiers: { set_num: setNum },
      parameters: params as Record<string, string> | undefined
    })

    if (url === undefined) throw new Error('// GET SET MINIFIGS: Invalid URL parameters')

    return await this.fetchApi(url)
  }

  public async getSetAlternateBuilds (
    setNum: string, params?: SetAlternatesRequest
  ): Promise<APIListResponse<SetAlternate>> {
    const url = getApiQueryFromParams({
      endpoint: rebrickableUrls.setAlternates,
      identifiers: { set_num: setNum },
      parameters: params as Record<string, string> | undefined
    })

    if (url === undefined) throw new Error('// GET SET ALTERNATE BUILDS: Invalid URL parameters')

    return await this.fetchApi(url)
  }
}

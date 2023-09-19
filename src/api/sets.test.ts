import { beforeAll, afterEach, describe, it, expect, vi } from 'vitest'
import { mockServer, genericGetCall } from '../test/utils'
import * as utils from '../utils/getApiQueryUrlFromParams'
import { APIListResponse, Set } from '../models'
import { SetsApi } from './sets'
import {
  setInventorySets,
  setAlternates,
  setMinifigs,
  singleSet,
  setParts,
  listSets
} from '../test/data'

describe('Sets Api Test Suite', async () => {
  let setsApi: SetsApi

  beforeAll(() => {
    setsApi = new SetsApi('TEST_TOKEN')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('List Sets API Endpoint', async () => {
    it('Should get a list of sets', async () => {
      const url = 'https://rebrickable.com/api/v3/lego/sets'
      mockServer.use(
        genericGetCall<APIListResponse<Set>>(url, listSets)
      )

      const response = await setsApi.getSets({ min_year: 2002 })
      expect(response).toStrictEqual(listSets)
    })

    it('Should return 400 for invalid request', async () => {
      const url = 'https://rebrickable.com/api/v3/lego/sets'
      mockServer.use(
        genericGetCall(url, {}, 400)
      )

      try {
        await setsApi.getSets()
      } catch (e: any) {
        expect(e.status).toEqual(400)
      }
    })

    it('Should return 401 for unauthorised access', async () => {
      const url = 'https://rebrickable.com/api/v3/lego/sets'
      mockServer.use(
        genericGetCall(url, { detail: 'Invalid token header. No credentials provided' }, 401)
      )

      try {
        await setsApi.getSets()
      } catch (e: any) {
        expect(e.status).toEqual(401)
        expect(await e.json()).toStrictEqual({
          detail: 'Invalid token header. No credentials provided'
        })
      }
    })

    it('Should throw error when url is undefined', async () => {
      vi
        .spyOn(utils, 'getApiQueryFromParams')
        .mockImplementationOnce(() => undefined)

      try {
        await setsApi.getSets()
      } catch (e: any) {
        expect(e.message).toEqual('// GET SETS: Invalid URL parameters')
      }
    })
  })

  it('Should retrieve a single set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1'
    mockServer.use(genericGetCall(url, singleSet))

    const response = await setsApi.getSet('010423-1')
    expect(response).toStrictEqual(singleSet)
  })

  it('Should retrieve inventory sets for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/sets'
    mockServer.use(genericGetCall(url, setInventorySets))

    const response = await setsApi.getSetInventorySets('010423-1')
    expect(response).toStrictEqual(setInventorySets)
  })

  it('Should retrieve alternate builds for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/alternates'
    mockServer.use(genericGetCall(url, setAlternates))

    const response = await setsApi.getSetAlternateBuilds('010423-1')
    expect(response).toStrictEqual(setAlternates)
  })

  it('Should retrieve minifigs for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/minifigs'
    mockServer.use(genericGetCall(url, setMinifigs))

    const response = await setsApi.getSetMinifigs('010423-1')
    expect(response).toStrictEqual(setMinifigs)
  })

  it('Should retrieve a parts list for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/parts'
    mockServer.use(genericGetCall(url, setParts))

    const response = await setsApi.getSetParts('010423-1')
    expect(response).toStrictEqual(setParts)
  })
})

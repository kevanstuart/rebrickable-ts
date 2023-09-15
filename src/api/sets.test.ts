import {
  setInventorySets,
  setAlternates,
  setMinifigs,
  singleSet,
  setParts,
  listSets
} from '../test/data'
import { beforeAll, describe, it, expect } from 'vitest'
import { mockServer } from '../test/utils'
import { SetsApi } from './sets'
import {
  DefaultBodyType,
  MockedRequest,
  ResponseComposition,
  RestContext,
  RestHandler,
  rest
} from 'msw'

function succesfulGetCall<T> (
  url: string,
  result: T
): RestHandler<MockedRequest<DefaultBodyType>> {
  return rest.get(
    url,
    async (
      _: any, res: ResponseComposition, ctx: RestContext
    ) => await res(ctx.status(200), ctx.json(result))
  )
}

describe('Sets Api Test Suite', async () => {
  let setsApi: SetsApi

  beforeAll(() => {
    setsApi = new SetsApi('TEST_TOKEN')
  })

  it('Should get a list of sets', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets'
    mockServer.use(succesfulGetCall(url, listSets))

    const response = await setsApi.getSets({ min_year: 2002 })
    expect(response).toStrictEqual(listSets)
  })

  it('Should retrieve a single set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1'
    mockServer.use(succesfulGetCall(url, singleSet))

    const response = await setsApi.getSet('010423-1')
    expect(response).toStrictEqual(singleSet)
  })

  it('Should retrieve inventory sets for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/sets'
    mockServer.use(succesfulGetCall(url, setInventorySets))

    const response = await setsApi.getSetInventorySets('010423-1')
    expect(response).toStrictEqual(setInventorySets)
  })

  it('Should retrieve alternate builds for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/alternates'
    mockServer.use(succesfulGetCall(url, setAlternates))

    const response = await setsApi.getSetAlternateBuilds('010423-1')
    expect(response).toStrictEqual(setAlternates)
  })

  it('Should retrieve minifigs for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/minifigs'
    mockServer.use(succesfulGetCall(url, setMinifigs))

    const response = await setsApi.getSetMinifigs('010423-1')
    expect(response).toStrictEqual(setMinifigs)
  })

  it('Should retrieve a parts list for a set', async () => {
    const url = 'https://rebrickable.com/api/v3/lego/sets/010423-1/parts'
    mockServer.use(succesfulGetCall(url, setParts))

    const response = await setsApi.getSetParts('010423-1')
    expect(response).toStrictEqual(setParts)
  })
})

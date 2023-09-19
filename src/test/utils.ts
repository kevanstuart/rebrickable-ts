import { setupServer } from 'msw/node'
import {
  ResponseComposition,
  DefaultBodyType,
  MockedRequest,
  RestContext,
  RestHandler,
  rest
} from 'msw'

export const mockServer = setupServer()

export function genericGetCall<T> (
  url: string,
  result: T,
  status: number = 200
): RestHandler<MockedRequest<DefaultBodyType>> {
  return rest.get(
    url,
    async (
      _: any,
      res: ResponseComposition,
      ctx: RestContext
    ) => await res(ctx.status(status), ctx.json(result))
  )
}

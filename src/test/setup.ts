import { beforeAll, afterEach, afterAll } from 'vitest'
import { mockServer } from './utils'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
afterEach(() => mockServer.resetHandlers())

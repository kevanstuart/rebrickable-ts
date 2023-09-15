/**
 * An endpoint consists of
 * 1. The base URL i.e. rebrickable.com/api/v3
 * 2. An API endpoint i.e /lego/sets/:set_num/sets
 * 3. An identifier i.e. :set_num requires a set number identifier
 * 4. Query parameters i.e. sorting and filtering
 */

export const rebrickableUrls = {
  sets: '/lego/sets',
  set: '/lego/sets/:set_num',
  setSets: '/lego/sets/:set_num/sets',
  setParts: '/lego/sets/:set_num/parts',
  setMinifigs: '/lego/sets/:set_num/minifigs',
  setAlternates: '/lego/sets/:set_num/alternates'
} as const

export type RebrickableUrls = keyof typeof rebrickableUrls

export const baseUrl = 'https://rebrickable.com/api/v3'

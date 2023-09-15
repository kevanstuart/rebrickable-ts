import type { ExternalIds, Part } from '../../../models/part'
import type { Set, SetAlternate, SetMinifig } from '../../../models/set'

export const sets: Set[] = [
  {
    set_num: '30386-1',
    name: 'Poe Dameron\'s X-wing Fighter',
    year: 2020,
    theme_id: 158,
    num_parts: 72,
    set_img_url: 'https://cdn.rebrickable.com/media/sets/30386-1/55595.jpg',
    set_url: 'https://rebrickable.com/sets/30386-1/poe-damerons-x-wing-fighter/',
    last_modified_dt: '2021-01-03T15:19:09.755055Z'
  },
  {
    set_num: '30388-1',
    name: 'Imperial Shuttle',
    year: 2021,
    theme_id: 158,
    num_parts: 85,
    set_img_url: 'https://cdn.rebrickable.com/media/sets/30388-1/78179.jpg',
    set_url: 'https://rebrickable.com/sets/30388-1/imperial-shuttle/',
    last_modified_dt: '2020-12-11T18:52:52.223666Z'
  },
  {
    set_num: '30495-1',
    name: 'AT-ST',
    year: 2022,
    theme_id: 158,
    num_parts: 79,
    set_img_url: 'https://cdn.rebrickable.com/media/sets/30495-1/95998.jpg',
    set_url: 'https://rebrickable.com/sets/30495-1/at-st/',
    last_modified_dt: '2022-04-27T06:34:59.034371Z'
  },
  {
    set_num: '30625-1',
    name: 'Luke Skywalker with Blue Milk',
    year: 2022,
    theme_id: 158,
    num_parts: 6,
    set_img_url: 'https://cdn.rebrickable.com/media/sets/30625-1/76531.jpg',
    set_url: 'https://rebrickable.com/sets/30625-1/luke-skywalker-with-blue-milk/',
    last_modified_dt: '2021-12-02T05:46:48.185848Z'
  },
  {
    set_num: '30654-1',
    name: 'X-Wing Starfighter',
    year: 2023,
    theme_id: 158,
    num_parts: 87,
    set_img_url: 'https://cdn.rebrickable.com/media/sets/30654-1/116335.jpg',
    set_url: 'https://rebrickable.com/sets/30654-1/x-wing-starfighter/',
    last_modified_dt: '2023-05-05T20:44:35.950944Z'
  }
]

const externalIds: ExternalIds = {
  BrickLink: ['3005pb053'],
  BrickOwl: ['567846'],
  Brickset: ['72087'],
  LEGO: ['72087']
}

export const parts: Part[] = [
  {
    part_num: '3005pr0025',
    name: 'Brick 1 x 1 with Blue Milk / Bantha Carton Print',
    part_cat_id: 11,
    part_url: 'https://rebrickable.com/parts/3005pr0025/brick-1-x-1-with-blue-milk-bantha-carton-print/',
    part_img_url: 'https://cdn.rebrickable.com/media/parts/photos/73/3005pr0025-73-355c2e46-bc69-4fd2-8354-9cd9d627056a.jpg',
    external_ids: externalIds,
    print_of: '3005'
  },
  {
    part_num: '54200',
    name: 'Slope 30° 1 x 1 x 2/3 (Cheese Slope)',
    part_cat_id: 3,
    part_url: 'https://rebrickable.com/parts/54200/slope-30-1-x-1-x-23-cheese-slope/',
    part_img_url: 'https://cdn.rebrickable.com/media/parts/elements/4244370.jpg',
    external_ids: externalIds,
    print_of: null
  }
]

export const minifigs: SetMinifig[] = [
  {
    id: 20567,
    set_num: 'fig-010697',
    set_name: 'Luke Skywalker, White Robe, Blue Milk Mouth',
    quantity: 1,
    set_img_url: null
  }
]

export const alternates: SetAlternate[] = [
  {
    set_num: 'MOC-100250',
    name: 'Spaceship 3 (30386 C Model)',
    year: 2022,
    theme_id: 158,
    num_parts: 42,
    moc_img_url: 'https://cdn.rebrickable.com/media/mocs/moc-100250.jpg',
    moc_url: 'https://rebrickable.com/mocs/MOC-100250/jemunoz0/spaceship-3-30386-c-model/',
    designer_name: 'jemunoz0',
    designer_url: 'https://rebrickable.com/users/jemunoz0/mocs/'
  },
  {
    set_num: 'MOC-101118',
    name: 'Spaceship 4 (30386 C Model)',
    year: 2022,
    theme_id: 158,
    num_parts: 46,
    moc_img_url: 'https://cdn.rebrickable.com/media/mocs/moc-101118.jpg',
    moc_url: 'https://rebrickable.com/mocs/MOC-101118/jemunoz0/spaceship-4-30386-c-model/',
    designer_name: 'jemunoz0',
    designer_url: 'https://rebrickable.com/users/jemunoz0/mocs/'
  }
]

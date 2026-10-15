/**
 * Rebrickable API endpoint paths, relative to the API base URL.
 * `:name` segments are placeholders filled in by `buildPath`.
 */
export const ENDPOINTS = {
  COLORS: {
    BASE: '/lego/colors/',
    DETAIL: '/lego/colors/:id/',
  },
  ELEMENTS: {
    DETAIL: '/lego/elements/:element_id/',
  },
  MINIFIGS: {
    BASE: '/lego/minifigs/',
    DETAIL: '/lego/minifigs/:set_num/',
    PARTS: '/lego/minifigs/:set_num/parts/',
    SETS: '/lego/minifigs/:set_num/sets/',
  },
  PART_CATEGORIES: {
    BASE: '/lego/part_categories/',
    DETAIL: '/lego/part_categories/:id/',
  },
  PARTS: {
    BASE: '/lego/parts/',
    DETAIL: '/lego/parts/:part_num/',
    COLORS: '/lego/parts/:part_num/colors/',
    COLOR_DETAIL: '/lego/parts/:part_num/colors/:color_id/',
    COLOR_SETS: '/lego/parts/:part_num/colors/:color_id/sets/',
  },
  SETS: {
    BASE: '/lego/sets/',
    DETAIL: '/lego/sets/:set_num/',
    ALTERNATES: '/lego/sets/:set_num/alternates/',
    MINIFIGS: '/lego/sets/:set_num/minifigs/',
    PARTS: '/lego/sets/:set_num/parts/',
    SETS: '/lego/sets/:set_num/sets/',
  },
  THEMES: {
    BASE: '/lego/themes/',
    DETAIL: '/lego/themes/:id/',
  },
  USERS: {
    BADGES: '/users/badges/',
    BADGE_DETAIL: '/users/badges/:id/',
    TOKEN: '/users/_token/',
    ALL_PARTS: '/users/:user_token/allparts/',
    BUILD: '/users/:user_token/build/:set_num/',
    LOST_PARTS: '/users/:user_token/lost_parts/',
    MINIFIGS: '/users/:user_token/minifigs/',
    PARTLISTS: '/users/:user_token/partlists/',
    PARTLIST_PARTS: '/users/:user_token/partlists/:list_id/parts/',
    PARTS: '/users/:user_token/parts/',
    PROFILE: '/users/:user_token/profile/',
    SETLISTS: '/users/:user_token/setlists/',
    SETLIST_SETS: '/users/:user_token/setlists/:list_id/sets/',
    SETS: '/users/:user_token/sets/',
    SETS_SYNC: '/users/:user_token/sets/sync/',
  },
} as const;

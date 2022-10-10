/**
 * Rebrickable API endpoints for wrapping
 */
export enum Colors {
  BASE = '/lego/colors',
}

export enum Elements {
  BASE = '/lego/elements',
}

export enum Themes {
  BASE = '/lego/themes',
}

export enum Sets {
  BASE = '/lego/sets',
  SETS = '/lego/sets/:set_num/sets',
  PARTS = '/lego/sets/:set_num/parts',
  MINIFIGS = '/lego/sets/:set_num/minifigs',
  ALTERNATES = '/lego/sets/:set_num/alternates',
}

export enum Minifigs {
  BASE = '/lego/minifigs',
  PARTS = '/lego/minifigs/:set_num/parts',
  SETS = '/lego/minifigs/:set_num/sets',
}

export enum Parts {
  BASE = '/lego/parts',
  COLORS = '/lego/parts/:part_num/colors',
  COLORSETS = '/lego/parts/:part_num/colors/:color_id/sets',
}

export enum PartCategories {
  BASE = '/lego/part_categories',
}

export enum UserBadges {
  BASE = '/users/badges',
}

export enum UserToken {
  BASE = '/users/_token',
}

export enum UserParts {
  BASE = '/users/:user_token/parts',
  LOST = '/users/:user_token/lost_parts',
  ALLPARTS = '/users/:user_token/allparts',
  LIST = '/users/:user_token/partlists',
  LISTPARTS = '/users/:user_token/partlists/:list_id/parts',
}

export enum UserBuild {
  BASE = '/users/:user_token/build',
}

export enum UserMinifigs {
  BASE = '/users/:user_token/minifigs',
}

export enum UserProfile {
  BASE = '/users/:user_token/profile',
}

export enum UserSetLists {
  BASE = '/users/:user_token/setlists',
  SETS = '/users/:user_token/setlists/:list_id/sets',
}

export enum UserSets {
  BASE = '/users/:user_token/sets',
  SYNC = '/users/:user_token/sets/sync',
}

export const ENDPOINTS = {
  COLORS: Colors,
  SETS: Sets,
  MINIFIGS: Minifigs,
  ELEMENTS: Elements,
  THEMES: Themes,
  PARTS: Parts,
  PARTCATEGORIES: PartCategories,
  USER: {
    BADGES: UserBadges,
    TOKEN: UserToken,
    PARTS: UserParts,
    BUILD: UserBuild,
    MINIFIGS: UserMinifigs,
    PROFILE: UserProfile,
    SETLISTS: UserSetLists,
    SETS: UserSets,
  },
};

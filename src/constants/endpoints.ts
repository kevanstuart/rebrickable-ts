export enum Endpoints {
  /**
   * * Colors API
   * * * colors
   * * * colors/{id}
   */
  'Colors' = '/lego/colors',
  /**
   * * Elements API
   * * * elements/{element_id}
   */
  'Elements' = '/lego/elements',
  /**
   * * Themes API
   * * * themes
   * * * themes/{id}
   */
  'Themes' = '/lego/themes',
  /**
   * * Minigfigs API
   * * * minifigs
   * * * minifigs/{set_num}
   * * * minifigs/{set_num}/parts
   * * * minifigs/{set_num}/sets
   */
  'Minifigs' = '/lego/minifigs',
  'MinifigParts' = '/lego/minifigs/:set_num/parts',
  'MinifigSets' = '/lego/minifigs/:set_num/sets',
  /**
   * * Parts API
   * * * parts
   * * * parts/{part_num}
   * * * parts/{part_num}/colors
   * * * parts/{part_num}/colors/{color_id}
   * * * parts/{part_num}/colors/{color_id}/sets
   */
  'Parts' = '/lego/parts',
  'PartColors' = '/lego/parts/:part_num/colors',
  'PartColorsSets' = '/lego/parts/:part_num/colors/:color_id/sets',
  /**
   * * PartCategories API
   * * * part_categories
   * * * part_categories/{id}
   */
  'PartCategories' = '/lego/part_categories',
  /**
   * * Sets API
   * * * sets
   * * * sets/{set_num}
   * * * sets/{set_num}/alternates
   * * * sets/{set_num}/minifigs
   * * * sets/{set_num}/parts
   * * * sets/{set_num}/sets
   */
  'Sets' = '/lego/sets',
  'SetsAlternates' = '/lego/sets/:set_num/alternates',
  'SetsMinifigs' = '/lego/sets/:set_num/minifigs',
  'SetsParts' = '/lego/sets/:set_num/parts',
  'SetsSets' = '/lego/sets/:set_num/sets',
  /**
   * * Users API
   * * * users/badges
   * * * users/badges/{id}
   * * * users/_token
   * * * users/{user_token}/allparts
   * * * users/{user_token}/build/{set_num}
   * * * users/{user_token}/lost_parts
   * * * users/{user_token}/lost_parts/{id}
   * * * users/{user_token}/minifigs/
   * * * users/{user_token}/partlists
   * * * users/{user_token}/partlists/{list_id}
   * * * users/{user_token}/partlists/{list_id}/parts
   * * * users/{user_token}/partlists/{list_id}/parts/{part_num}/{color_id}
   * * * users/{user_token}/parts
   * * * users/{user_token}/profile
   * * * users/{user_token}/setlists
   * * * users/{user_token}/setlists/{list_id}
   * * * users/{user_token}/setlists/{list_id}/sets
   * * * users/{user_token}/setlists/{list_id}/sets/{set_num}
   * * * users/{user_token}/sets
   * * * users/{user_token}/sets/{set_num}
   * * * users/{user_token}/sets/sync
   */
  'UserBadges' = '/users/badges',
  'UserToken' = '/users/_token',
  'UserAllParts' = '/users/:user_token/allparts',
  'UserBuild' = '/users/:user_token/build',
  'UserLostParts' = '/users/:user_token/lost_parts',
  'UserMinifigs' = '/users/:user_token/minifigs',
  'UserPartLists' = '/users/:user_token/partlists',
  'UserPartListParts' = '/users/:user_token/partlists/:list_id/parts',
  'UserParts' = '/users/:user_token/parts',
  'UserProfile' = '/users/:user_token/profile',
  'UserSetLists' = '/users/:user_token/setlists',
  'UserSetListSets' = '/users/:user_token/setlists/:list_id/sets',
  'UserSets' = '/users/:user_token/sets',
  'UserSetSync' = '/users/:user_token/sets/sync',
}

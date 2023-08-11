/* eslint-disable unicorn/no-null */
import { ApiListResults, Set } from '../models';

export const getSetsResult: ApiListResults<Set> = {
  count: 1,
  previous: null,
  next: null,
  results: [
    {
      set_num: '75034-1',
      name: 'AT-TE',
      year: 2002,
      theme_id: 1,
      num_parts: 1000,
      set_img_url: 'http://someurl.com',
      set_url: 'http://someurl.com',
      last_modified_dt: new Date(),
    },
  ],
};

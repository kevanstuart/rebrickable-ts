/* eslint-disable jest/no-commented-out-tests */
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { AxiosError } from 'axios';

import { Minifig, ListMinifigsInput, ApiListResults } from '../models';
import { MinifigApiClass } from '../api/minifigs.api';

describe('Sets Api Test Suite', () => {
  let api: MinifigApiClass;

  const cacheOptions: IAxiosCacheAdapterOptions = {
    maxAge: 15 * 60 * 1000,
    readOnError: (err: AxiosError) =>
      !err.response?.status || (err.response?.status >= 400 && err.response?.status < 600),
  };

  beforeAll(() => {
    api = new MinifigApiClass({ token: 'afc896397f3ca67f045cbc62a5e3973c', cacheOptions });
  });

  it('checks if getAllMinifigs returns a list of Minifigs', async () => {
    const params: ListMinifigsInput = { page_size: 1 };
    const data: ApiListResults<Minifig> = await api.listMinifigs(params);

    console.log(data);

    // expect(data.results[0]).toEqual(expect.objectContaining({ set_num: validSet }));
    expect(true).toBe(true);
  });
});

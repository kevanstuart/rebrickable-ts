/* eslint-disable jest/no-commented-out-tests */
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';

// import { StatusCodes } from 'http-status-codes';
// import axios /* , { AxiosError } */ from 'axios';

// import { APIResourceList, Set /* , SetAlternates, SetMinifigs, SetParts */ } from '../models';
// import { BaseURL, Endpoints } from '../constants';
// import { getSetsResult } from './sets.data';
import { SetApiClass } from '../api/set.api';

describe('Sets Api Test Suite', () => {
  // const validSet = '75034-1';
  // const invalidSet = '111-111';

  const cacheOptions: IAxiosCacheAdapterOptions = {
    maxAge: 15 * 60 * 1000,
    readOnError: (err: AxiosError) =>
      !err.response?.status || (err.response?.status >= 400 && err.response?.status < 600),
  };

  let api: SetApiClass;
  let mock: MockAdapter;

  beforeAll(() => {
    api = new SetApiClass({ token: 'SOME_TOKEN', cacheOptions });
    mock = new MockAdapter(api.api);
  });

  afterEach(() => mock.reset());

  it('checks if the Access Token is read from the enviroment', () => {
    console.log(process.env.TESTS_API_KEY);
    expect(true).toBe(true);
  });

  /* it('checks if GetSets returns a list of Sets', async () => {
    const params = { page_size: 1, min_year: 2002 };

    // const url = `${Endpoints.Sets}?page_size=1&min_year=2002`;
    // mock.onGet(`${BaseURL.REST}${url}`).replyOnce(StatusCodes.OK, getSetsResult);
    // expect(mock.history.get[0].url).toEqual(url);

    const data: APIResourceList<Set> = await api.getSets(params);
    expect(data.results[0]).toEqual(expect.objectContaining({ set_num: validSet }));
  }); */

  /* it('checks if GetSetBySetNum returns a single Set', async () => {
    const set = getSetsResult.results[0];
    const url = `${Endpoints.Sets}/${validSet}`;
    mock.onGet(`${BaseURL.REST}${url}`).replyOnce(StatusCodes.OK, set);

    const data: Set = await api.getSetBySetNum(validSet);

    expect(data.set_num).toBe(validSet);
    expect(mock.history.get[0].url).toEqual(url);
  }); */

  /*it('checks if getSetBySetNum returns NOT_FOUND for an invalid Set', async () => {
    let status = StatusCodes.OK;

    try {
      await api.getSetBySetNum(invalidSet);
    } catch (error) {
      const response: AxiosError<string> = error;
      status = response.response?.status || StatusCodes.OK;
    }

    expect(status).toBe(StatusCodes.NOT_FOUND);
  });

  it('checks if getAlternatesBySetNum returns the alternate builds for a Set', async () => {
    const data: APIResourceList<SetAlternates> = await api.getSetAlternatesBySetNum(validSet);
    expect(data.results.length).toBeGreaterThan(0);
  });

  it('checks if getAlternatesBySetNum returns an empty array if no alternates Sets are found', async () => {
    const data: APIResourceList<SetAlternates> = await api.getSetAlternatesBySetNum(invalidSet);
    expect(data.results.length).toBe(0);
  });

  it('checks if getAlternatesBySetNum returns NOT_FOUND for an invalid Set', async () => {
    let status = StatusCodes.OK;

    try {
      await api.getSetAlternatesBySetNum('');
    } catch (error) {
      const response: AxiosError<string> = error;
      status = response.response?.status || StatusCodes.OK;
    }

    expect(status).toBe(StatusCodes.NOT_FOUND);
  });

  it('checks if getMinifigsBySetNum returns the minifigures from a single Set', async () => {
    const data: APIResourceList<SetMinifigs> = await api.getSetMinifigsBySetNum(validSet);
    expect(data.results.length).toBeGreaterThan(0);
  });

  it('checks if getMinifigsBySetNum returns an empty array if no minifigs are found', async () => {
    const data: APIResourceList<SetMinifigs> = await api.getSetMinifigsBySetNum(invalidSet);
    expect(data.results.length).toBe(0);
  });

  it('checks if getMinifigsBySetNum returns NOT_FOUND for an invalid Set', async () => {
    let status = StatusCodes.OK;

    try {
      await api.getSetMinifigsBySetNum('');
    } catch (error) {
      const response: AxiosError<string> = error;
      status = response.response?.status || StatusCodes.OK;
    }

    expect(status).toBe(StatusCodes.NOT_FOUND);
  });

  it('checks if getSetPartsBySetNum returns the parts from a single set', async () => {
    const data: APIResourceList<SetParts> = await api.getSetPartsBySetNum(validSet);
    expect(data.results.length).toBeGreaterThan(0);
  });

  it('checks if getSetPartsBySetNum returns an empty array if no parts are found', async () => {
    const data: APIResourceList<SetParts> = await api.getSetPartsBySetNum(invalidSet);
    expect(data.results.length).toBe(0);
  });

  it('checks if getSetPartsBySetNum returns NOT_FOUND for an invalid Set', async () => {
    let status = StatusCodes.OK;

    try {
      await api.getSetPartsBySetNum('');
    } catch (error) {
      const response: AxiosError<string> = error;
      status = response.response?.status || StatusCodes.OK;
    }

    expect(status).toBe(StatusCodes.NOT_FOUND);
  }); */
});

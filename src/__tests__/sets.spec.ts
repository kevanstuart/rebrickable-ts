import { StatusCodes } from 'http-status-codes';
import { AxiosError } from 'axios';

import { APIResourceList, Set, SetAlternates, SetMinifigs, SetParts } from '../models';
import { SetApiClass } from '../api/set.api';

describe('Sets Api Test Suite', () => {
  const validSet = '75034-1';
  const invalidSet = '111-111';

  let api: SetApiClass;

  beforeAll(() => {
    api = new SetApiClass({ token: 'afc896397f3ca67f045cbc62a5e3973c' });
  });

  it('checks if GetSets returns a list of Sets', async () => {
    const data: APIResourceList<Set> = await api.getSets({ page_size: 1, min_year: 2002 });
    expect(data.results.length).toBeGreaterThan(0);
  });

  it('checks if GetSets follows the page_size parameter', async () => {
    const data: APIResourceList<Set> = await api.getSets({ page_size: 1 });
    expect(data.results.length).toBe(1);
  });

  it('checks if GetSets follows the search parameter', async () => {
    const data: APIResourceList<Set> = await api.getSets({ search: 'AT-TE' });
    expect(data.results.length).toBe(data.count);
  });

  it('checks if GetSetBySetNum returns a single Set', async () => {
    const data: Set = await api.getSetBySetNum(validSet);
    expect(data.set_num).toBe(validSet);
  });

  it('checks if getSetBySetNum returns NOT_FOUND for an invalid Set', async () => {
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
  });
});

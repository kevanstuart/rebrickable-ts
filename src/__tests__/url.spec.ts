import { describe, expect, it } from 'vitest';
import { appendQuery, buildPath } from '../http/url';

describe('buildPath', () => {
  it('fills placeholders with URL-encoded values', () => {
    expect(buildPath('/lego/sets/:set_num/parts/', { set_num: '75034-1' })).toBe(
      '/lego/sets/75034-1/parts/',
    );
    expect(buildPath('/lego/parts/:part_num/', { part_num: '3001/x' })).toBe(
      '/lego/parts/3001%2Fx/',
    );
  });

  it('fills multiple placeholders', () => {
    expect(
      buildPath('/lego/parts/:part_num/colors/:color_id/sets/', { part_num: '3001', color_id: 4 }),
    ).toBe('/lego/parts/3001/colors/4/sets/');
  });

  it('throws when a placeholder is missing or empty', () => {
    expect(() => buildPath('/lego/sets/:set_num/')).toThrow(/set_num/);
    expect(() => buildPath('/lego/sets/:set_num/', { set_num: '' })).toThrow(/set_num/);
  });
});

describe('appendQuery', () => {
  it('encodes values and skips undefined', () => {
    const url = appendQuery(new URL('https://example.com/'), {
      search: 'Star Wars & co',
      page_size: 10,
      min_year: undefined,
    });

    expect(url.search).toBe('?search=Star+Wars+%26+co&page_size=10');
  });

  it('sends true flags as 1 and leaves false flags out', () => {
    const url = appendQuery(new URL('https://example.com/'), {
      inc_part_details: true,
      inc_minifig_parts: false,
    });

    expect(url.search).toBe('?inc_part_details=1');
  });

  it('rejects values that cannot be sent as a query parameter', () => {
    expect(() => appendQuery(new URL('https://example.com/'), { search: { a: 1 } })).toThrow(
      /search/,
    );
  });
});

import { describe, expect, it } from 'vitest';
import { filterPublished, isExternal, type PostLike } from '../../src/lib/posts-core';

const p = (id: string, date: string, extra: Partial<PostLike['data']> = {}): PostLike => ({
  id, data: { date: new Date(date), ...extra },
});

describe('isExternal', () => {
  it('is true only when externalUrl is set', () => {
    expect(isExternal(p('a', '2020-01-01', { externalUrl: 'https://medium.com/x' }))).toBe(true);
    expect(isExternal(p('b', '2020-01-01'))).toBe(false);
    expect(isExternal(p('c', '2020-01-01', { externalUrl: '' }))).toBe(false);
  });
});

describe('filterPublished', () => {
  it('drops drafts and sorts newest first', () => {
    const out = filterPublished([
      p('old', '2019-05-02'),
      p('draft', '2030-01-01', { draft: true }),
      p('new', '2022-11-17'),
      p('mid', '2020-05-04', { draft: false }),
    ]);
    expect(out.map((x) => x.id)).toEqual(['new', 'mid', 'old']);
  });
  it('returns [] when only drafts exist', () => {
    expect(filterPublished([p('d', '2024-01-01', { draft: true })])).toEqual([]);
  });
  it('does not mutate the input array', () => {
    const input = [p('a', '2019-01-01'), p('b', '2022-01-01')];
    filterPublished(input);
    expect(input.map((x) => x.id)).toEqual(['a', 'b']);
  });
});

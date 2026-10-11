import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/lib/url';

describe('withBase', () => {
  it('joins a sub-path base and a path with exactly one slash', () => {
    expect(withBase('/blog/', '/portfolio')).toBe('/portfolio/blog/');
    expect(withBase('blog/', '/portfolio/')).toBe('/portfolio/blog/');
  });
  it('returns the base root for empty or "/" path', () => {
    expect(withBase('/', '/portfolio')).toBe('/portfolio/');
    expect(withBase('', '/portfolio/')).toBe('/portfolio/');
  });
  it('keeps hash and query', () => {
    expect(withBase('/#apps', '/portfolio')).toBe('/portfolio/#apps');
    expect(withBase('/cv.pdf?v=2', '/portfolio')).toBe('/portfolio/cv.pdf?v=2');
  });
  it('works with root base (custom domain)', () => {
    expect(withBase('/blog/', '/')).toBe('/blog/');
    expect(withBase('/#apps', '/')).toBe('/#apps');
  });
  it('leaves absolute and mailto URLs untouched', () => {
    expect(withBase('https://medium.com/@x', '/portfolio')).toBe('https://medium.com/@x');
    expect(withBase('mailto:a@b.c', '/portfolio')).toBe('mailto:a@b.c');
  });
});

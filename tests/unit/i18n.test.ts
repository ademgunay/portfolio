import { describe, expect, it } from 'vitest';
import { LANGS, DEFAULT_LANG, ui, t, pick, formatMonth, isLang } from '../../src/i18n/ui';
import { localePath, switchLocalePath, langFromPath, nonDefaultLangs } from '../../src/i18n/paths';

describe('dictionary', () => {
  it('every locale has exactly the English keys, all non-empty', () => {
    const keys = Object.keys(ui.en).sort();
    for (const lang of LANGS) {
      expect(Object.keys(ui[lang]).sort()).toEqual(keys);
      for (const k of keys) expect((ui[lang] as Record<string, string>)[k].trim()).not.toBe('');
    }
  });
  it('t() interpolates {vars} and falls through unknown vars untouched', () => {
    expect(t('en', 'store.badgeAria', { name: 'WYZauto', store: 'App Store' })).toBe('WYZauto on App Store (opens in a new tab)');
    expect(t('fr', 'footer.text', { year: 2026, name: 'Adem Gunay' })).toBe('© 2026 Adem Gunay · Réalisé avec Astro');
  });
  it('pick() returns the value for the locale', () => {
    expect(pick({ en: 'a', fr: 'b' }, 'fr')).toBe('b');
  });
  it('formatMonth() normalizes September', () => {
    expect(formatMonth('en', '2018-09')).toBe('Sep 2018');
    expect(formatMonth('fr', '2018-09').toLowerCase().startsWith('sept')).toBe(true);
  });

  it('formatMonth() is locale-aware and UTC-stable', () => {
    expect(formatMonth('en', '2025-01')).toBe('Jan 2025');
    expect(formatMonth('fr', '2025-01')).toBe('janv. 2025');
  });
  it('isLang() and defaults', () => {
    expect(isLang(DEFAULT_LANG)).toBe(true);
    expect(isLang('xx')).toBe(false);
    expect(nonDefaultLangs()).toEqual(LANGS.filter((l) => l !== DEFAULT_LANG));
  });
});

describe('localePath', () => {
  it('keeps English at the root and prefixes other locales', () => {
    expect(localePath('en', '/#apps', '/portfolio')).toBe('/portfolio/#apps');
    expect(localePath('fr', '/#apps', '/portfolio')).toBe('/portfolio/fr/#apps');
    expect(localePath('fr', '/', '/portfolio')).toBe('/portfolio/fr/');
    expect(localePath('fr', '/blog/', '/')).toBe('/fr/blog/');
  });
  it('leaves absolute and mailto URLs untouched', () => {
    expect(localePath('fr', 'https://medium.com/@x', '/portfolio')).toBe('https://medium.com/@x');
    expect(localePath('fr', 'mailto:a@b.c', '/portfolio')).toBe('mailto:a@b.c');
  });
});

describe('switchLocalePath / langFromPath', () => {
  it('maps home and writing list both ways', () => {
    expect(switchLocalePath('/portfolio/', 'fr', '/portfolio')).toBe('/portfolio/fr/');
    expect(switchLocalePath('/portfolio/fr/', 'en', '/portfolio')).toBe('/portfolio/');
    expect(switchLocalePath('/portfolio/blog/', 'fr', '/portfolio')).toBe('/portfolio/fr/blog/');
    expect(switchLocalePath('/portfolio/fr/blog/', 'en', '/portfolio')).toBe('/portfolio/blog/');
    expect(switchLocalePath('/portfolio', 'fr', '/portfolio')).toBe('/portfolio/fr/');
  });
  it('maps an English-only local post to the French writing list', () => {
    expect(switchLocalePath('/portfolio/blog/my-post/', 'fr', '/portfolio')).toBe('/portfolio/fr/blog/');
    expect(switchLocalePath('/portfolio/blog/my-post/', 'en', '/portfolio')).toBe('/portfolio/blog/my-post/');
  });
  it('works with a root base (custom domain)', () => {
    expect(switchLocalePath('/', 'fr', '/')).toBe('/fr/');
    expect(switchLocalePath('/fr/blog/', 'en', '/')).toBe('/blog/');
  });
  it('detects the language of a path', () => {
    expect(langFromPath('/portfolio/fr/blog/', '/portfolio')).toBe('fr');
    expect(langFromPath('/portfolio/', '/portfolio')).toBe('en');
    expect(langFromPath('/portfolio/french-fries/', '/portfolio')).toBe('en');
  });
});

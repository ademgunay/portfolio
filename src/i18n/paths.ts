import { withBase } from '../lib/url';
import { DEFAULT_LANG, LANGS, isLang, type Lang } from './ui';

const ABSOLUTE = /^[a-z][a-z\d+.-]*:/i;

export const nonDefaultLangs = (): Lang[] => LANGS.filter((l) => l !== DEFAULT_LANG);

/** Path inside the current locale: '/#apps' → '/portfolio/fr/#apps' for French. */
export function localePath(lang: Lang, path: string, base: string = import.meta.env.BASE_URL): string {
  if (ABSOLUTE.test(path)) return path;
  const p = path.replace(/^\/+/, '');
  return withBase(lang === DEFAULT_LANG ? `/${p}` : `/${lang}/${p}`, base);
}

/** Strip base and any locale prefix → [lang, rest-without-leading-slash]. */
function split(pathname: string, base: string): [Lang, string] {
  const b = base.replace(/\/+$/, '');
  let rest = pathname.startsWith(b) ? pathname.slice(b.length) : pathname;
  rest = rest.replace(/^\/+/, '');
  const first = rest.split('/')[0];
  if (first && first !== DEFAULT_LANG && isLang(first)) return [first, rest.slice(first.length).replace(/^\/+/, '')];
  return [DEFAULT_LANG, rest];
}

export function langFromPath(pathname: string, base: string = import.meta.env.BASE_URL): Lang {
  return split(pathname, base)[0];
}

/** The equivalent page in another locale. Local posts are English-only → non-default locales get the writing list. */
export function switchLocalePath(pathname: string, to: Lang, base: string = import.meta.env.BASE_URL): string {
  let [, rest] = split(pathname, base);
  if (to !== DEFAULT_LANG && /^blog\/[^/]+/.test(rest)) rest = 'blog/';
  return localePath(to, `/${rest}`, base);
}

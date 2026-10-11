// Single source of truth for where the site is served and which languages it has.
// Used by astro.config.mjs, playwright.config.ts, tests/e2e/helpers.ts, lighthouserc.cjs and src/i18n.
export const SITE = 'https://ademgunay.github.io';
export const BASE = '/portfolio';
export const LANGS = /** @type {const} */ (['en', 'fr']);
export const DEFAULT_LANG = 'en';

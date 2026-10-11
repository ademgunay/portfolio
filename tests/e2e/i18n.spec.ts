import { expect, test } from '@playwright/test';
import { BASE, gotoHome, homePath } from './helpers';
import { ui } from '../../src/i18n/ui';

const isMobile = (name: string) => name === 'mobile';
const FR = homePath('fr');

test('French home is French', async ({ page }) => {
  await gotoHome(page, 'fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('#apps')).toContainText('Applis que j’ai développées');
  await expect(page.locator('#skills')).toContainText('Compétences');
  await expect(page.locator('#contact')).toContainText('Parlons-en');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fr_FR');
});

test('no English UI leaks on the French home (Review Focus #3)', async ({ page }) => {
  await gotoHome(page, 'fr');
  // Code-style labels are intentionally untranslated (global constraints).
  const text = (await page.locator('body').innerText()).replace(/object Skills/g, '');
  // Keys that never render as visible text (meta, locale codes, aria-only labels).
  const hidden = new Set(['skip', 'lang.short', 'lang.switchLabel', 'lang.toggleAria', 'nav.primary', 'nav.home', 'nav.menuAria', 'apps.railAria', 'apps.screenshotAlt', 'hero.screensAlt', 'store.badgeAria', 'about.languagesAria', 'contact.copyTitle', 'contact.copyHint', 'writing.inEnglish']);
  const phrases = (Object.keys(ui.en) as (keyof typeof ui.en)[])
    .filter((k) => !k.startsWith('locale.') && !k.startsWith('meta.') && !hidden.has(k) && !ui.en[k].includes('{') && ui.en[k] !== ui.fr[k])
    .map((k) => ui.en[k]);
  expect(phrases.length).toBeGreaterThan(10);
  const escape = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const phrase of phrases) expect(text, phrase).not.toMatch(new RegExp(`(^|[^\\p{L}])${escape(phrase)}($|[^\\p{L}])`, 'u'));
});

test('hreflang alternates and canonical on both homes', async ({ page }) => {
  for (const [lang, self] of [['en', BASE], ['fr', FR]] as const) {
    await gotoHome(page, lang);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${self}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', new RegExp(`${BASE}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute('href', new RegExp(`${FR}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', new RegExp(`${BASE}$`));
  }
});

test('toggle keeps the section, both directions (Review Focus #1)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.goto(`${BASE}#skills`);
  await page.getByRole('link', { name: 'Version française' }).click();
  await expect(page).toHaveURL(new RegExp(`${FR}#skills$`));
  await expect(page.locator('#skills')).toBeInViewport();
  await page.getByRole('link', { name: 'English version' }).click();
  await expect(page).toHaveURL(new RegExp(`${BASE}#skills$`));
  await expect(page.locator('#skills')).toBeInViewport();
});

test('toggle follows the section scrolled to by hand, with no URL hash (I1)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.goto(BASE);
  await page.evaluate(() => document.querySelector('#experience')!.scrollIntoView());
  await expect(page.locator('#experience')).toBeInViewport();
  expect(new URL(page.url()).hash).toBe('');
  await page.getByRole('link', { name: 'Version française' }).click();
  await expect(page).toHaveURL(new RegExp(`${FR}#experience$`));
  await expect(page.locator('#experience')).toBeInViewport();
});

test('toggle uses the current section, not a stale hash (I1)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.goto(BASE);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Apps', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${BASE}#apps$`));
  await expect(page.locator('#apps')).toBeInViewport();
  // Wait for the smooth scroll to settle before scrolling away by hand.
  await page.waitForFunction(() => new Promise<boolean>((done) => {
    const y = scrollY;
    setTimeout(() => done(scrollY === y), 300);
  }));
  await page.mouse.move(600, 400);
  await expect(async () => {
    await page.mouse.wheel(0, 1500);
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 500 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('link', { name: 'Version française' }).click();
  await expect(page).toHaveURL(new RegExp(`${FR}#contact$`));
});

test('toggle link accessible name contains its visible text (I2)', async ({ page }) => {
  await gotoHome(page, 'en');
  const link = page.getByRole('link', { name: 'Version française' }).first();
  await expect(link).toHaveAccessibleName(/^fr\b.*Version française/);
});

test('current language is marked in the toggle', async ({ page }) => {
  await gotoHome(page, 'fr');
  const group = page.getByRole('group', { name: 'Langue' }).first();
  await expect(group.locator('[aria-current="true"]')).toHaveText('FR');
});

test('French nav and writing links stay French (Review Focus #2)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.goto(`${FR}blog/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('[data-post]')).toHaveCount(5);
  await expect(page.locator('[data-post]').first()).toContainText('EN');
  const nav = page.getByRole('navigation', { name: 'Principale' });
  await expect(nav.getByRole('link', { name: 'Applis', exact: true })).toHaveAttribute('href', `${FR}#apps`);
  await expect(nav.getByRole('link', { name: 'Articles', exact: true })).toHaveAttribute('href', `${FR}blog/`);
  await nav.getByRole('link', { name: 'Applis', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${FR}#apps$`));
});

test('French apps show French role and story', async ({ page }) => {
  await gotoHome(page, 'fr');
  const items = page.locator('[data-showcase-list] > li');
  await expect(items).toHaveCount(6);
  await expect(items.nth(1)).toContainText('Ingénieur mobile senior → Lead de l’équipe Android');
  await expect(items.last()).toContainText('Plus disponible sur les stores');
});

test('toggle is visible on mobile without opening the menu and fits (Review Focus #5)', async ({ page }, info) => {
  test.skip(!isMobile(info.project.name));
  await gotoHome(page, 'en');
  const toggle = page.getByRole('link', { name: 'Version française' }).first();
  await expect(toggle).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 360, height: 740 });
  const overflow360 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow360).toBeLessThanOrEqual(0);
});

test('toggle tap target is at least as tall as the menu button on mobile (M1)', async ({ page }, info) => {
  test.skip(!isMobile(info.project.name));
  await gotoHome(page, 'en');
  const toggle = await page.getByRole('link', { name: 'Version française' }).first().boundingBox();
  const menu = await page.locator('[data-mobile-menu] summary').boundingBox();
  expect(toggle!.height).toBeGreaterThanOrEqual(menu!.height - 1);
});

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  test('toggle still navigates to the French home', async ({ page }, info) => {
    test.skip(isMobile(info.project.name));
    await page.goto(BASE);
    await page.getByRole('link', { name: 'Version française' }).first().click();
    await expect(page).toHaveURL(new RegExp(`${FR}$`));
  });
});

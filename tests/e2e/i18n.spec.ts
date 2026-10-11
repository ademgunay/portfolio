import { expect, test } from '@playwright/test';
import { BASE, gotoHome, homePath } from './helpers';

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
  const text = await page.locator('body').innerText();
  for (const phrase of ['See my apps', 'Download CV', "Apps I've built", "Let's talk", 'All writing', 'No longer on the stores', 'Built with Astro', 'Present']) {
    expect(text, phrase).not.toContain(phrase);
  }
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

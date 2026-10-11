import { expect, test } from '@playwright/test';
import { BASE, gotoHome } from './helpers';

test('hero shows name, title, and CTAs', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Adem Gunay');
  await expect(page.getByText('Lead Frontend Engineer · Android & Flutter')).toBeVisible();
  await expect(page.getByRole('link', { name: 'See my apps' })).toHaveAttribute('href', `${BASE}#apps`);
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', `${BASE}cv.pdf`);
});

test('nav has section links and Writing link', async ({ page }) => {
  await gotoHome(page);
  const nav = page.getByRole('navigation', { name: 'Primary' });
  for (const [name, hash] of [['Apps', 'apps'], ['Experience', 'experience'], ['Skills', 'skills'], ['About', 'about']]) {
    await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute('href', `${BASE}#${hash}`);
  }
  await expect(nav.getByRole('link', { name: 'Writing', exact: true })).toHaveAttribute('href', `${BASE}blog/`);
});

test('SEO meta and JSON-LD are present', async ({ page }) => {
  await gotoHome(page);
  await expect(page).toHaveTitle(/Adem Gunay/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new RegExp(`${BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}og-image\\.png$`));
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@type']).toBe('Person');
  expect(ld.sameAs).toContain('https://medium.com/@gunayadem.dev');
});

test('skip link moves focus to main', async ({ page }) => {
  await gotoHome(page);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('no "open to opportunities" badge by default', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByText('Open to opportunities')).toHaveCount(0);
});

test('mobile menu overlay stays full-screen after scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHome(page);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForFunction(() => window.scrollY > 24);
  await page.getByText('menu', { exact: true }).click();
  const list = page.locator('[data-mobile-menu] ul');
  await expect(list.getByRole('link', { name: 'Experience' })).toBeVisible();
  const box = await list.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(700);
});

test('mobile menu closes on Escape and returns focus to the toggle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHome(page);
  const summary = page.locator('[data-mobile-menu] summary');
  await summary.click();
  await expect(page.locator('[data-mobile-menu]')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-mobile-menu]')).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
});
